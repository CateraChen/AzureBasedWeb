#!/usr/bin/env bash

if [ -z "${BASH_VERSION:-}" ]; then
  echo "Please run this script with bash, for example: bash azure-setup.sh"
  exit 1
fi

set -euo pipefail

# Non-container Azure setup helper.
# Usage:
#   1. Fill the variables below.
#   2. chmod +x scripts/azure-setup.sh
#   3. ./scripts/azure-setup.sh

RG_NAME="test-rg1"
LOCATION="eastus"
APP_SERVICE_PLAN_NAME="ASP-testrg-ad234"
APP_SERVICE_SKU="F1"
APP_SERVICE_OS="windows"
BACKEND_WEBAPP_NAME="cateraapi"
FRONTEND_STORAGE_ACCOUNT="cpstoragecatera"
ENABLE_AZURE_SQL="false"
SQL_SERVER_NAME="cp-wanjiadenghuo-sql"
SQL_DATABASE_NAME="TestDb"
SQL_ADMIN_USER="testadmin"
SQL_ADMIN_PASSWORD="$(openssl rand -base64 24 | tr -d '\n' | cut -c1-24)!aA1"
JWT_SECRET=""
AZURE_CA_BUNDLE=""
AZURE_TENANT_ID="0cdc5456-ead8-4965-b281-f2402f059112"
AZURE_SUBSCRIPTION_ID="279e4a1a-e18e-419f-87dc-40d8b1a12557"

require_var() {
  local name="$1"
  local value="$2"
  if [ -z "$value" ]; then
    echo "Missing required value: $name"
    exit 1
  fi
}

echo "Checking Azure CLI..."
if ! command -v az >/dev/null 2>&1; then
  echo "az not found. Install it on macOS with: brew update && brew install azure-cli"
  exit 1
fi

require_var "BACKEND_WEBAPP_NAME" "$BACKEND_WEBAPP_NAME"
require_var "FRONTEND_STORAGE_ACCOUNT" "$FRONTEND_STORAGE_ACCOUNT"
if [ "$ENABLE_AZURE_SQL" = "true" ]; then
  require_var "SQL_SERVER_NAME" "$SQL_SERVER_NAME"
  require_var "SQL_ADMIN_USER" "$SQL_ADMIN_USER"
  require_var "SQL_ADMIN_PASSWORD" "$SQL_ADMIN_PASSWORD"
fi

if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
fi

if [ -n "$AZURE_CA_BUNDLE" ]; then
  if [ ! -f "$AZURE_CA_BUNDLE" ]; then
    echo "AZURE_CA_BUNDLE does not point to a readable file: $AZURE_CA_BUNDLE"
    exit 1
  fi

  export REQUESTS_CA_BUNDLE="$AZURE_CA_BUNDLE"
  export SSL_CERT_FILE="$AZURE_CA_BUNDLE"
fi

print_azure_login_failure_hint() {
  local log_file="$1"

  cat "$log_file"
  echo

  if grep -qiE 'Certificate verification failed|UNEXPECTED_EOF_WHILE_READING|CERTIFICATE_VERIFY_FAILED|self-signed certificate|proxy' "$log_file"; then
    echo "Azure CLI login failed while verifying TLS certificates."
    echo "If you are behind a proxy or custom root CA, set AZURE_CA_BUNDLE to the trusted PEM file and rerun."
    echo "Example: export AZURE_CA_BUNDLE=/path/to/company-root-ca.pem"
  else
    echo "Azure CLI login failed. Fix the authentication problem above and rerun the script."
  fi

  rm -f "$log_file"
  exit 1
}

login_to_azure() {
  if az account show >/dev/null 2>&1; then
    return 0
  fi

  echo "Logging in to Azure..."
  local login_output_file
  login_output_file=$(mktemp)

  if [ -n "$AZURE_TENANT_ID" ]; then
    echo "Using tenant: $AZURE_TENANT_ID"
    if ! az login --tenant "$AZURE_TENANT_ID" >"$login_output_file" 2>&1; then
      if ! az login --tenant "$AZURE_TENANT_ID" --use-device-code >>"$login_output_file" 2>&1; then
        print_azure_login_failure_hint "$login_output_file"
      fi
    fi
  else
    if ! az login >"$login_output_file" 2>&1; then
      if ! az login --use-device-code >>"$login_output_file" 2>&1; then
        print_azure_login_failure_hint "$login_output_file"
      fi
    fi
  fi

  rm -f "$login_output_file"
}

ensure_subscription() {
  local subscription_count
  subscription_count=$(az account list --query 'length([])' -o tsv)
  if [ "$subscription_count" = "0" ]; then
    echo "No Azure subscriptions are available for the current account in this tenant."
    echo "Confirm that your account has an active Azure subscription, or switch to the correct tenant."
    echo "If needed, set AZURE_TENANT_ID at the top of this script and rerun it."
    exit 1
  fi

  if [ -n "$AZURE_SUBSCRIPTION_ID" ]; then
    az account set --subscription "$AZURE_SUBSCRIPTION_ID"
  fi
}

ensure_provider_registered() {
  local namespace="$1"
  local state

  state=$(az provider show --namespace "$namespace" --query registrationState -o tsv 2>/dev/null || echo "NotRegistered")
  if [ "$state" != "Registered" ]; then
    echo "Registering Azure resource provider: $namespace"
    az provider register --namespace "$namespace" >/dev/null

    while true; do
      state=$(az provider show --namespace "$namespace" --query registrationState -o tsv)
      if [ "$state" = "Registered" ]; then
        break
      fi

      echo "Waiting for provider registration: $namespace ($state)"
      sleep 5
    done
  fi
}

ensure_storage_account_name_available() {
  local name="$1"
  local name_available
  local reason
  local message

  name_available=$(az storage account check-name --name "$name" --query nameAvailable -o tsv)
  if [ "$name_available" != "true" ]; then
    reason=$(az storage account check-name --name "$name" --query reason -o tsv 2>/dev/null || true)
    message=$(az storage account check-name --name "$name" --query message -o tsv 2>/dev/null || true)

    echo "Storage account name '$name' is already taken or unavailable."
    if [ -n "$reason" ]; then
      echo "Reason: $reason"
    fi
    if [ -n "$message" ]; then
      echo "Details: $message"
    fi
    echo "Update FRONTEND_STORAGE_ACCOUNT to a unique lowercase name between 3 and 24 characters, then rerun the script."
    exit 1
  fi
}

login_to_azure
ensure_subscription

ensure_provider_registered "Microsoft.Web"
ensure_provider_registered "Microsoft.Storage"
if [ "$ENABLE_AZURE_SQL" = "true" ]; then
  ensure_provider_registered "Microsoft.Sql"
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RG_SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG_NAME"

create_app_service_plan() {
  local output_file
  output_file=$(mktemp)

  if [ "$APP_SERVICE_OS" = "linux" ]; then
    az appservice plan create \
      --name "$APP_SERVICE_PLAN_NAME" \
      --resource-group "$RG_NAME" \
      --is-linux \
      --sku "$APP_SERVICE_SKU" >"$output_file" 2>&1
  else
    az appservice plan create \
      --name "$APP_SERVICE_PLAN_NAME" \
      --resource-group "$RG_NAME" \
      --sku "$APP_SERVICE_SKU" >"$output_file" 2>&1
  fi

  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    cat "$output_file"

    if grep -qi 'Operation cannot be completed without additional quota' "$output_file"; then
      echo
      echo "App Service cannot be created in subscription $SUBSCRIPTION_ID and region $LOCATION because the current quota is 0 for SKU $APP_SERVICE_SKU."
      echo "This blocks Azure App Service deployment regardless of script settings."
      echo
      echo "Options:"
      echo "  1. Request an App Service quota increase for this subscription in Azure Portal."
      echo "  2. Switch to another Azure subscription that has Microsoft.Web quota."
      echo "  3. Try a different region by changing LOCATION, if your quota is region-specific."
      echo "  4. Change hosting target away from App Service."
      rm -f "$output_file"
      exit 1
    fi

    rm -f "$output_file"
    exit $exit_code
  fi

  rm -f "$output_file"
}

echo "Creating resource group..."
az group create --name "$RG_NAME" --location "$LOCATION" >/dev/null

echo "Ensuring App Service plan exists..."
if ! az appservice plan show --resource-group "$RG_NAME" --name "$APP_SERVICE_PLAN_NAME" >/dev/null 2>&1; then
  echo "Creating App Service plan with SKU: $APP_SERVICE_SKU ($APP_SERVICE_OS)"
  create_app_service_plan
fi

echo "Ensuring backend Web App exists..."
if ! az webapp show --resource-group "$RG_NAME" --name "$BACKEND_WEBAPP_NAME" >/dev/null 2>&1; then
  if [ "$APP_SERVICE_OS" = "linux" ]; then
    az webapp create \
      --resource-group "$RG_NAME" \
      --plan "$APP_SERVICE_PLAN_NAME" \
      --name "$BACKEND_WEBAPP_NAME" \
      --runtime "DOTNETCORE:8.0" >/dev/null
  else
    az webapp create \
      --resource-group "$RG_NAME" \
      --plan "$APP_SERVICE_PLAN_NAME" \
      --name "$BACKEND_WEBAPP_NAME" \
      --runtime "dotnet:8" >/dev/null
  fi
fi

echo "Ensuring frontend storage account exists..."
ensure_storage_account_name_available "$FRONTEND_STORAGE_ACCOUNT"
if ! az storage account show --resource-group "$RG_NAME" --name "$FRONTEND_STORAGE_ACCOUNT" >/dev/null 2>&1; then
  az storage account create \
    --name "$FRONTEND_STORAGE_ACCOUNT" \
    --resource-group "$RG_NAME" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2 >/dev/null
fi

echo "Enabling static website hosting..."
az storage blob service-properties update \
  --account-name "$FRONTEND_STORAGE_ACCOUNT" \
  --static-website \
  --index-document index.html \
  --404-document index.html \
  --auth-mode login >/dev/null

BACKEND_URL="https://$BACKEND_WEBAPP_NAME.azurewebsites.net"
FRONTEND_URL=$(az storage account show \
  --resource-group "$RG_NAME" \
  --name "$FRONTEND_STORAGE_ACCOUNT" \
  --query "primaryEndpoints.web" \
  -o tsv | sed 's:/$::')

AZURE_SQL_CONNECTION_STRING=""
if [ "$ENABLE_AZURE_SQL" = "true" ]; then
  echo "Ensuring Azure SQL server exists..."
  if ! az sql server show --resource-group "$RG_NAME" --name "$SQL_SERVER_NAME" >/dev/null 2>&1; then
    az sql server create \
      --resource-group "$RG_NAME" \
      --name "$SQL_SERVER_NAME" \
      --location "$LOCATION" \
      --admin-user "$SQL_ADMIN_USER" \
      --admin-password "$SQL_ADMIN_PASSWORD" >/dev/null
  fi

  echo "Allowing Azure services to reach SQL Server..."
  az sql server firewall-rule create \
    --resource-group "$RG_NAME" \
    --server "$SQL_SERVER_NAME" \
    --name AllowAzureServices \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0 >/dev/null

  echo "Ensuring Azure SQL database exists..."
  if ! az sql db show --resource-group "$RG_NAME" --server "$SQL_SERVER_NAME" --name "$SQL_DATABASE_NAME" >/dev/null 2>&1; then
    az sql db create \
      --resource-group "$RG_NAME" \
      --server "$SQL_SERVER_NAME" \
      --name "$SQL_DATABASE_NAME" \
      --service-objective Basic >/dev/null
  fi

  AZURE_SQL_CONNECTION_STRING="Server=tcp:$SQL_SERVER_NAME.database.windows.net,1433;Initial Catalog=$SQL_DATABASE_NAME;Persist Security Info=False;User ID=$SQL_ADMIN_USER;Password=$SQL_ADMIN_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
else
  echo "Skipping Azure SQL provisioning because ENABLE_AZURE_SQL=false"
fi

echo "Configuring backend application settings..."
if [ "$ENABLE_AZURE_SQL" = "true" ]; then
  az webapp config appsettings set \
    --resource-group "$RG_NAME" \
    --name "$BACKEND_WEBAPP_NAME" \
    --settings \
      ASPNETCORE_ENVIRONMENT=Production \
      AllowedOrigins="$FRONTEND_URL" \
      ConnectionStrings__DefaultConnection="$AZURE_SQL_CONNECTION_STRING" \
      Jwt__Secret="$JWT_SECRET" \
      Jwt__Issuer=wanjiadenghuo-api \
      Jwt__Audience=wanjiadenghuo-frontend >/dev/null
else
  az webapp config appsettings set \
    --resource-group "$RG_NAME" \
    --name "$BACKEND_WEBAPP_NAME" \
    --settings \
      ASPNETCORE_ENVIRONMENT=Production \
      Database__Provider=InMemory \
      AllowedOrigins="$FRONTEND_URL" \
      Jwt__Secret="$JWT_SECRET" \
      Jwt__Issuer=wanjiadenghuo-api \
      Jwt__Audience=wanjiadenghuo-frontend >/dev/null
fi

echo "Creating service principal for GitHub Actions..."
SP_NAME="http://wanjiadenghuo-ci-sp-$(date +%s)"
AZURE_CREDENTIALS=$(az ad sp create-for-rbac \
  --name "$SP_NAME" \
  --role contributor \
  --scopes "$RG_SCOPE" \
  --sdk-auth)

SP_APP_ID=$(az ad sp list --display-name "$SP_NAME" --query "[0].appId" -o tsv)
STORAGE_SCOPE=$(az storage account show --resource-group "$RG_NAME" --name "$FRONTEND_STORAGE_ACCOUNT" --query id -o tsv)

echo "Granting blob data access to the service principal..."
az role assignment create \
  --assignee "$SP_APP_ID" \
  --role "Storage Blob Data Contributor" \
  --scope "$STORAGE_SCOPE" >/dev/null

echo
echo "Azure resources are ready. Save the following GitHub secrets:"
echo
echo "AZURE_CREDENTIALS"
echo "$AZURE_CREDENTIALS"
echo
echo "AZURE_BACKEND_RESOURCE_GROUP=$RG_NAME"
echo "AZURE_BACKEND_WEBAPP_NAME=$BACKEND_WEBAPP_NAME"
echo "AZURE_FRONTEND_STORAGE_ACCOUNT=$FRONTEND_STORAGE_ACCOUNT"
if [ "$ENABLE_AZURE_SQL" = "true" ]; then
  echo "AZURE_SQL_CONNECTION_STRING=$AZURE_SQL_CONNECTION_STRING"
else
  echo "AZURE_SQL_CONNECTION_STRING is not generated because ENABLE_AZURE_SQL=false"
fi
echo "JWT_SECRET=$JWT_SECRET"
echo
echo "Useful endpoints:"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo
echo "After adding the GitHub secrets, push to main or run the Deploy Azure workflow manually."

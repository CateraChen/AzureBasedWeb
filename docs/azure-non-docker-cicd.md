# Azure 非 Docker CI/CD

这套配置使用代码部署，不走 Docker、ACR 或容器编排。

## 部署目标

- 后端：Azure App Service，运行 .NET 8
- 前端：Azure Storage Static Website，部署 Vite 构建产物
- 数据库：Azure SQL Database，可通过 `ENABLE_AZURE_SQL` 开关临时关闭创建
- CI/CD：GitHub Actions

## 已新增内容

- `.github/workflows/ci.yml`
  - PR 和 `main` 分支推送时构建前后端
- `.github/workflows/deploy-azure.yml`
  - `main` 分支推送或手动触发时部署 Azure
  - 后端部署前会执行 EF Core 数据库迁移
  - 前端会上传到 Storage Static Website 的 `$web` 容器
- `scripts/azure-setup.sh`
  - 创建 Azure 资源并输出 GitHub 需要的 secrets

> 说明：前端 package 已移动到仓库根目录，因此 CI/CD 里的前端安装与构建都应在根目录执行，直接使用根目录 `package-lock.json` 和 `npm run build`。

## 初始化 Azure

1. 编辑 `scripts/azure-setup.sh` 顶部变量，至少填写这些值：
  - `APP_SERVICE_SKU`：默认 `D1`，优先规避 `Free VMs` 和 `Basic VMs` 配额不足
  - `APP_SERVICE_OS`：默认 `windows`，与 `D1` 共享层兼容
  - `ENABLE_AZURE_SQL`：默认 `false`，当前阶段不创建 Azure SQL
   - `BACKEND_WEBAPP_NAME`
   - `FRONTEND_STORAGE_ACCOUNT`
   - `SQL_SERVER_NAME`、`SQL_ADMIN_USER`、`SQL_ADMIN_PASSWORD`：仅当 `ENABLE_AZURE_SQL=true` 时需要
  - `AZURE_TENANT_ID`：如果账号在多个 Entra ID tenant 下，建议显式指定
  - `AZURE_SUBSCRIPTION_ID`：如果一个 tenant 下有多个订阅，可选填
2. 本地执行：

```bash
chmod +x scripts/azure-setup.sh
./scripts/azure-setup.sh
```

3. 脚本会输出以下 GitHub secrets，把它们配置到仓库里：
   - `AZURE_CREDENTIALS`
   - `AZURE_BACKEND_RESOURCE_GROUP`
   - `AZURE_BACKEND_WEBAPP_NAME`
   - `AZURE_FRONTEND_STORAGE_ACCOUNT`
  - `AZURE_SQL_CONNECTION_STRING`：仅当 `ENABLE_AZURE_SQL=true` 时输出
   - `JWT_SECRET`

### 登录问题

- 如果浏览器登录因为 MFA 失败，脚本会自动回退到 `az login --use-device-code`。
- 如果登录时报 `Certificate verification failed`、`UNEXPECTED_EOF_WHILE_READING` 或类似 TLS 错误，通常是代理或公司根证书没有被 Azure CLI 信任。先把根证书保存成 PEM 文件，然后设置 `AZURE_CA_BUNDLE=/path/to/company-root-ca.pem` 再运行脚本。
- 如果提示 `StorageAccountAlreadyTaken`，说明 `FRONTEND_STORAGE_ACCOUNT` 这个名字在全局范围内已经被占用。换一个 3 到 24 位、全小写字母和数字的名字再运行。
- 如果提示 `No subscriptions found`，这不是脚本问题，而是当前登录账号在该 tenant 下没有可用 Azure 订阅。
- 如果提示 `MissingSubscriptionRegistration`，脚本现在会自动注册常用 provider，包括 `Microsoft.Web`、`Microsoft.Storage` 和 `Microsoft.Sql`。
- 如果提示 `Operation cannot be completed without additional quota` 且指向 `Free VMs` 或 `Basic VMs`，优先尝试 `windows + D1` 共享层。脚本现在默认就是这个组合。
- 如果 `F1`、`D1`、`B1` 都因为 quota 为 `0` 失败，那么这个订阅当前无法用 Azure App Service，必须换订阅、换区域或申请配额，脚本本身无法绕过。
- 这种情况下需要先确认两件事：
  - 你的账号是否真的被分配到了 Azure 订阅
  - `AZURE_TENANT_ID` 是否指向了有订阅的 tenant

## 工作流行为

### CI

- 后端执行 `dotnet restore` 和 `dotnet build`
- 前端执行 `npm ci` 和 `npm run build`

### CD

- 后端：
  - 登录 Azure
  - 若配置了 `AZURE_SQL_CONNECTION_STRING`，对 Azure SQL 执行 `dotnet ef database update`
  - `dotnet publish`
  - 使用 `az webapp deploy` 做 Zip Deploy
  - 同步 App Service 配置；有连接串时写入连接串，没有则只写 JWT 和 AllowedOrigins
- 前端：
  - `npm ci`
  - `npm run build`
  - 清空 `$web`
  - 上传 `frontend/dist`

## 运行时配置

后端部署时会写入这些 App Settings：

- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection`
- `Jwt__Secret`
- `Jwt__Issuer=wanjiadenghuo-api`
- `Jwt__Audience=wanjiadenghuo-frontend`
- `AllowedOrigins=<Azure Storage Static Website URL>`

当 `ENABLE_AZURE_SQL=false` 时，不会写入 `ConnectionStrings__DefaultConnection`，而是写入 `Database__Provider=InMemory`。

前端构建时会自动使用：

- `VITE_API_URL=https://<AZURE_BACKEND_WEBAPP_NAME>.azurewebsites.net`

## 当前限制

- 生产环境只做数据库迁移，不会自动执行 `DbSeeder.SeedAsync`。
- 当 `ENABLE_AZURE_SQL=false` 时，初始化脚本和工作流都不会创建或迁移 Azure SQL，后端会临时切到内存数据库。
- 如果你需要 Azure 首次部署时自动灌入演示数据，需要再补一个受控的生产种子开关，不能直接复用当前 `Development` 分支逻辑。


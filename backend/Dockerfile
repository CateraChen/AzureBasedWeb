FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/ .
RUN dotnet restore WanJiaDengHuo.API/WanJiaDengHuo.API.csproj
RUN dotnet publish WanJiaDengHuo.API/WanJiaDengHuo.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "WanJiaDengHuo.API.dll"]

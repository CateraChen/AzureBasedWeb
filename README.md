# 万家灯火贸易平台 (WanJiaDengHuo) 🧥

万家灯火贸易有限公司旗下的精品服装电商平台。致力于提供高品质的贸易与零售体验，结合现代数字化技术，打造极致的购物享受。

## 🌟 核心特性

- **现代视觉体验**：采用高端 3D 悬浮布局、玻璃拟态设计，完美展示时尚单品。
- **流畅购物流程**：支持快速搜索、多维度筛选以及无缝集成的侧边购物车系统。
- **全栈架构设计**：采用解耦的后端 API 设计（Clean Architecture）与高性能 React 前端。
- **开发者体验**：集成了一键启动脚本与内存数据库支持，方便快速开发与测试。

## 🛠 技术栈

### 后端
- **框架**: .NET 8 / ASP.NET Core
- **架构**: 领域驱动设计 (DDD) / 整洁架构
- **数据库**: EF Core 支持 SQL Server 与 In-Memory 模式
- **设计模式**: CQRS (MediatR), Repository Pattern, Unit of Work

### 前端
- **框架**: React 19 (TypeScript)
- **构建工具**: Vite
- **状态管理**: TanStack Query (React Query) v5
- **样式**: 现代 CSS (CSS Variables, Glassmorphism, Responsive Grid)

## 🚀 快速启动

### 环境准备
- Node.js (v18+)
- .NET 8 SDK

### 本地开发

运行以下命令同时启动前后端：

```bash
npm install
npm run dev
```

系统会自动：
1. 启动 **前端** 开发服务器 (Vite)。
2. 使用 `InMemory` 数据库运行 **后端 API**，实现零配置秒开。

## 📁 项目结构

- `backend/`: 万家灯火电商方案的后端核心逻辑。
- `frontend/`: 基于 React + Vite 的高性能购物前端。
- `scripts/`: 开发与部署自动化脚本。

---
*万家灯火，温暖每一家。*

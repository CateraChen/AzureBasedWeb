# WanJiaDengHuo Rebranding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Global rebranding from "WanJiaDengHuo" (Wine) to "WanJiaDengHuo" (Clothing), including file/folder renames, code refactoring, and data transformation.

**Architecture:** Systematic text replacement, followed by file system operations (moving/renaming), then entity/DTO structural changes to reflect the new product domain (Clothing).

**Tech Stack:** .NET 8, React/TypeScript, Shell scripting for mass renaming.

---

### Task 1: Global Text Replacement

**Files:**
- Modify: All files in the repository (excluding bin/obj/node_modules/.git)

- [ ] **Step 1: Perform case-sensitive replacements**
    - "WanJiaDengHuo" -> "WanJiaDengHuo"
    - "wanjiadenghuo" -> "wanjiadenghuo"
    - Run: `grep -rl "WanJiaDengHuo" . --exclude-dir={.git,node_modules,bin,obj} | xargs sed -i '' 's/WanJiaDengHuo/WanJiaDengHuo/g'`
    - Run: `grep -rl "wanjiadenghuo" . --exclude-dir={.git,node_modules,bin,obj} | xargs sed -i '' 's/wanjiadenghuo/wanjiadenghuo/g'`

- [ ] **Step 2: Commit global replacement**
    - Run: `git add . && git commit -m "chore: global rebranding text replacement"`

### Task 2: Rename Project Files and Folders

**Files:**
- Rename: Folders and files containing "WanJiaDengHuo" or "Bacc"

- [ ] **Step 1: Rename directories in backend/**
    - `backend/WanJiaDengHuo.API` -> `backend/WanJiaDengHuo.API`
    - `backend/WanJiaDengHuo.Application` -> `backend/WanJiaDengHuo.Application`
    - `backend/WanJiaDengHuo.Domain` -> `backend/WanJiaDengHuo.Domain`
    - `backend/WanJiaDengHuo.Infrastructure` -> `backend/WanJiaDengHuo.Infrastructure`
- [ ] **Step 2: Rename files (.sln, .csproj, .slnx)**
    - `WanJiaDengHuo.slnx` -> `WanJiaDengHuo.slnx`
    - Rename all `.csproj` files to match new folder names.
- [ ] **Step 3: Update file references in .slnx and .csproj**
    - Ensure namespaces and project references are updated to "WanJiaDengHuo".
- [ ] **Step 4: Commit renaming**
    - Run: `git commit -am "chore: rename projects and folders to WanJiaDengHuo"`

### Task 3: Transformation of Product Entity (Clothing Domain)

**Files:**
- Modify: `backend/WanJiaDengHuo.Domain/Entities/Product.cs`
- Modify: `backend/WanJiaDengHuo.Application/Common/DTOs/` (All relevant DTOs)
- Modify: `backend/WanJiaDengHuo.Infrastructure/Persistence/Configurations/ProductConfiguration.cs` (if exists)

- [ ] **Step 1: Update Product entity fields**
    - `WineType` -> `Category`
    - `Varietal` -> `Style`
    - `Region` -> `Brand`
    - `Winery` -> `Designer`
    - `Vintage` -> `ReleaseYear`
    - `Volume` -> `SizeRange`
- [ ] **Step 2: Update Product.Create method and private fields**
- [ ] **Step 3: Update DB Configurations if necessary**
- [ ] **Step 4: Propagate changes to Application layer DTOs and Logic**

### Task 4: Update Data Seeding

**Files:**
- Modify: `backend/WanJiaDengHuo.Infrastructure/Persistence/DbSeeder.cs`

- [ ] **Step 1: Replace wine seed data with 10+ high-quality clothing items**
    - Categories: Tops, Bottoms, Outerwear, Accessories.
    - Styles: Casual, Formal, Sportswear.
- [ ] **Step 2: Ensure correct field mapping in seeder**

### Task 5: Frontend Transformation

**Files:**
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/services/shop.ts` (and other services if needed)
- Modify: Components using these types (e.g., Shop page, Product cards)

- [ ] **Step 1: Update `ProductSummary` and `ProductDetail` interfaces in `frontend/src/types/index.ts`**
- [ ] **Step 2: Update `FilterOptions` interface**
- [ ] **Step 3: Update `shop.ts` service to use new field names in queries/parameters**
- [ ] **Step 4: Update UI components that display these fields (labels, values)**

### Task 6: Final Review and Recording

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Verify build (backend and frontend)**
- [ ] **Step 2: Record changes in `AGENTS.md`**
- [ ] **Step 3: Update `README.md` if necessary**

# SVG Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace text-based emojis and placeholder icons with modern, clean SVG icons to enhance the "modern, minimalist, and elegant" look of the wine store.

**Architecture:** Create a unified `Icon` component or a set of SVG components in a central location (`frontend/src/components/common/Icons.tsx`) and use them across the project. Icons will use `currentColor` and a consistent base class `icon-svg`.

**Tech Stack:** React, TypeScript, SVG.

---

### Task 1: Create Centralized Icon Components

**Files:**
- Create: `frontend/src/components/common/Icons.tsx`

- [ ] **Step 1: Define SVG icon components**
Create a file `frontend/src/components/common/Icons.tsx` that exports the following components:
  - `SearchIcon`
  - `CartIcon`
  - `XIcon` (Close)
  - `HeartIcon` (Wishlist/Star candidate, but user asked for ☆ replacement)
  - `GridIcon`
  - `ListIcon`
  - `UserIcon`
  - `GlobeIcon` (Language)

- [ ] **Step 2: Add CSS for `icon-svg` in `frontend/src/App.css`**
Add styles for the `.icon-svg` class to ensure consistent scaling and alignment.

---

### Task 2: Update ShopPage.tsx

**Files:**
- Modify: `frontend/src/pages/ShopPage.tsx`

- [ ] **Step 1: Replace Search emoji (🔍)**
Import `SearchIcon` and replace `<span className="search-icon">🔍</span>`.

- [ ] **Step 2: Replace Grid/List text with icons**
Import `GridIcon` and `ListIcon` and replace "Grid" and "List" text in view buttons.

---

### Task 3: Update CartSidebar.tsx

**Files:**
- Modify: `frontend/src/components/shop/CartSidebar.tsx`

- [ ] **Step 1: Replace Cart emoji (🛒)**
Import `CartIcon` and replace `<span className="cart-icon">🛒</span>`.

- [ ] **Step 2: Replace Close emoji (✕)**
Import `XIcon` and replace `✕` in the header and remove buttons.

---

### Task 4: Update ProductCard.tsx

**Files:**
- Modify: `frontend/src/components/shop/ProductCard.tsx`

- [ ] **Step 1: Replace Wishlist emoji (☆)**
Import `HeartIcon` (or `StarIcon` if preferred for ☆) and replace `☆` in the wishlist button.

---

### Task 5: Update Navbar.tsx

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx`

- [ ] **Step 1: Replace Language (🌐), Wishlist (☆), Account (👤/Initial), and Cart (🛒) icons**
Import relevant icons and replace the emojis and text placeholders.

---

### Task 6: Verification

- [ ] **Step 1: Visual check**
Ensure all icons are rendered correctly and inherit colors from their parent elements.
- [ ] **Step 2: Check responsiveness**
Ensure icons scale correctly on different screen sizes.

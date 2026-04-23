# Shop Page Layout Refinement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Further refine the shop page layout based on current UI feedback. Transform the bulky cart sidebar into a more elegant, integrated drawer or floating component, and improve product card presentation for a minimalist, premium look.

**Architecture:** 
- Convert `CartSidebar` into a sleek, slide-out drawer or a more minimal floating component.
- Refine `ProductCard` typography and spacing.
- Adjust `FilterPanel` to be more subtle (transparent background, clean borders).
- Enhance the "0 EXCEPTIONAL WINES FOUND" empty state area.

**Tech Stack:** React, CSS.

---

### Task 1: Refactor CartSidebar to a Modern Drawer

The current cart is too bulky and occupies too much permanent space.

**Files:**
- Modify: [frontend/src/components/shop/CartSidebar.tsx](frontend/src/components/shop/CartSidebar.tsx)
- Modify: [frontend/src/App.css](frontend/src/App.css)

- [ ] **Step 1: Update CartSidebar JSX**
Make it a toggleable drawer or a more refined floating card on the right.

```tsx
// frontend/src/components/shop/CartSidebar.tsx
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

export default function CartSidebar() {
  const { cart, loading, remove, clear } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen && cart.totalItems > 0) {
    return (
      <button className="cart-toggle-floating" onClick={() => setIsOpen(true)}>
        <span className="cart-icon">🛒</span>
        <span className="cart-count">{cart.totalItems}</span>
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>Your Selection</h2>
          <button className="close-drawer" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        
        <div className="cart-drawer-body">
          {cart.items.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your cart is empty</p>
              <span>Explore our collection to add items</span>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-drawer-item">
                <div className="item-details">
                  <p className="item-name">{item.productName}</p>
                  <p className="item-meta">{item.volume} • Qty: {item.quantity}</p>
                </div>
                <button className="remove-item" onClick={() => remove(item.id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-summary">
            <span>Total Items:</span>
            <span>{cart.totalItems}</span>
          </div>
          <button className="checkout-btn" disabled={cart.items.length === 0}>
            Request Quote
          </button>
          <button className="clear-all-btn" onClick={clear} disabled={loading || cart.items.length === 0}>
            Clear List
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Add Drawer Styles to App.css**
Replace old `.cart-sidebar` styles with drawer/floating styles.

```css
/* frontend/src/App.css */

/* Replaced CART SIDEBAR with Drawer Styles */
.cart-toggle-floating {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #9e2448;
  color: #fff;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(158, 36, 72, 0.3);
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s ease;
}

.cart-toggle-floating:hover {
  transform: scale(1.05);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fff;
  color: #9e2448;
  font-size: 12px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(2px);
  z-index: 1001;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100%;
  background: #fff;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 25px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.cart-drawer-header {
  padding: 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-drawer-header h2 {
  font-size: 20px;
  font-weight: 300;
  margin: 0;
}

.close-drawer {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.cart-drawer-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.cart-drawer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f9f9f9;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.item-meta {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.remove-item {
  background: none;
  border: none;
  color: #9e2448;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.7;
}

.cart-drawer-footer {
  padding: 24px;
  border-top: 1px solid #eee;
  background: #fdfdfd;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 14px;
}

.checkout-btn {
  width: 100%;
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 12px;
}

.clear-all-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #ddd;
  color: #888;
  padding: 12px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
}
```

### Task 2: Modernize Product Cards

**Files:**
- Modify: [frontend/src/App.css](frontend/src/App.css)

- [ ] **Step 1: Refine Product Card Styles**
Ensure cards look premium with clean edges, consistent typography, and subtle shadows.

```css
/* Replace old product card styles */
.pc-card {
  background: #fff;
  padding: 24px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.pc-card:hover {
  border-color: #ddd;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.pc-name {
  font-size: 18px;
  font-weight: 400;
  margin: 20px 0 8px;
  color: #1a1a1a;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pc-volume {
  font-size: 13px;
  color: #888;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pc-add-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 12px;
  width: 100%;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  border-radius: 2px;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s;
}

.pc-add-btn:hover:not(:disabled) {
  background: #9e2448;
}
```

### Task 3: Final Polish on Shop Page

**Files:**
- Modify: [frontend/src/pages/ShopPage.tsx](frontend/src/pages/ShopPage.tsx)

- [ ] **Step 1: Simplify Page Header & Filters**
Adjust the grid layout to account for the removed permanent cart.

```tsx
// frontend/src/pages/ShopPage.tsx
// ... update the main container to be 100% width or centered without aside ...

// <div className="shop-layout-container">
//   <aside className="shop-filters-sidebar"> ... </aside>
//   <main className="shop-results-main"> ... </main>
//   {/* Removed CartSidebar from here, moved to root scope */}
// </div>
```

- [ ] **Step 2: Update App.css for full-width layout**
```css
.shop-layout-container {
  display: flex;
  gap: 50px;
  padding-top: 20px;
}
```

### Task 4: Verification

- [ ] **Step 1: Check UI Consistency**
Ensure the cart drawer behaves correctly.
- [ ] **Step 2: Check responsiveness**
Ensure it works on smaller screens (drawer should probably be narrower or full width on mobile).

# Shop Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the shop page to be modern, minimalist, and elegant, specifically tailored for a wine boutique.

**Architecture:** 
- Implement a clean, wide-screen layout.
- Enhance the search experience with a floating/integrated search bar.
- Modernize the grid system and layout components.
- refine typography and color usage (deep burgundy accent with plenty of white space).

**Tech Stack:** React, CSS, Lucide Icons (if available, else standard emoji/svg).

---

### Task 1: Update ShopPage Structure

**Files:**
- Modify: [frontend/src/pages/ShopPage.tsx](frontend/src/pages/ShopPage.tsx)

- [ ] **Step 1: Refactor JSX structure for modern layout**
Update the layout to move the search bar into a hero-like section or a more integrated top bar. Refine the typography of the header.

```tsx
// frontend/src/pages/ShopPage.tsx
// ... imports ...

export default function ShopPage() {
  // ... state and queries ...

  return (
    <div className="shop-page">
      <header className="shop-header">
        <h1 className="shop-title">Exquisite Collection</h1>
        <p className="shop-subtitle">Discover the finest wines from around the world</p>
        
        <div className="search-container">
          <form className="shop-search-bar" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              className="shop-search-input"
              placeholder="Search by variety, region, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
      </header>

      <div className="shop-layout-container">
        {/* Filter on left, or as a modern sidebar */}
        <aside className="shop-filters-sidebar">
          {filterOptions && (
            <FilterPanel
              options={filterOptions}
              filters={filters}
              onChange={updateFilter}
              onReset={reset}
            />
          )}
        </aside>

        <main className="shop-results-main">
          <div className="shop-toolbar">
            <div className="results-count">
              {pagedResult?.totalCount ?? 0} Exceptional Wines Found
            </div>
            <div className="shop-view-options">
              <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid View"
              >
                Grid
              </button>
              <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List View"
              >
                List
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="shop-loading-state">
              <div className="spinner"></div>
              <p>Curating your selection...</p>
            </div>
          ) : (
            <div className="shop-grid-wrapper">
              <ProductGrid products={pagedResult?.items ?? []} view={view} />
              
              {pagedResult && pagedResult.totalPages > 1 && (
                <div className="shop-pagination-modern">
                  <button
                    className="pagination-btn"
                    disabled={!pagedResult.hasPrev}
                    onClick={() => updateFilter({ page: filters.page - 1 })}
                  >
                    Previous
                  </button>
                  <span className="page-indicator">
                    {pagedResult.page} <span>of</span> {pagedResult.totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    disabled={!pagedResult.hasNext}
                    onClick={() => updateFilter({ page: filters.page + 1 })}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <CartSidebar />
    </div>
  );
}
```

### Task 2: Modernize CSS for Shop Page

**Files:**
- Modify: [frontend/src/App.css](frontend/src/App.css)

- [ ] **Step 1: Overhaul .shop-page and related styles**
Replace the old `.shop-page` section with modern, flexible CSS using CSS variables and clean spacing.

```css
/* frontend/src/App.css */

/* Revamped SHOP PAGE section */
.shop-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;
  color: #2c2c2c;
  font-family: 'Inter', -apple-system, sans-serif;
  text-align: left; /* Reset from root search */
}

.shop-header {
  text-align: center;
  margin-bottom: 60px;
}

.shop-title {
  font-size: 42px;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.shop-subtitle {
  font-size: 16px;
  color: #666;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto 32px;
}

.search-container {
  max-width: 640px;
  margin: 0 auto;
}

.shop-search-bar {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 50px;
  padding: 8px 24px;
  transition: all 0.3s ease;
}

.shop-search-bar:focus-within {
  background: #fff;
  border-color: #9e2448;
  box-shadow: 0 4px 20px rgba(158, 36, 72, 0.08);
}

.search-icon {
  margin-right: 12px;
  font-size: 18px;
  opacity: 0.5;
}

.shop-search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  outline: none;
  color: #333;
}

.shop-layout-container {
  display: flex;
  gap: 40px;
}

.shop-filters-sidebar {
  width: 260px;
  flex-shrink: 0;
}

.shop-results-main {
  flex: 1;
}

.shop-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.results-count {
  font-size: 14px;
  font-weight: 500;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.shop-view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  background: transparent;
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.shop-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #999;
}

.shop-pagination-modern {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #f0f0f0;
}

.pagination-btn {
  background: transparent;
  border: 1px solid #222;
  color: #222;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #222;
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 14px;
  font-weight: 500;
}

.page-indicator span {
  color: #999;
  margin: 0 4px;
}
```

### Task 3: Verification

- [ ] **Step 1: Run dev server**
Run: `npm run dev` in `frontend` folder.

- [ ] **Step 2: Check visual layout**
Verify the new hero-like header, the pill-shaped search bar, and the sidebar layout.

- [ ] **Step 3: Test interactivity**
Verify search, filtering, and page navigation still work correctly with the new structure.

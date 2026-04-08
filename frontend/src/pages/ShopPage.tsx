import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FilterPanel from '../components/shop/FilterPanel';
import ProductGrid from '../components/shop/ProductGrid';
import CartSidebar from '../components/shop/CartSidebar';
import type { ProductFilters } from '../types';
import { fetchFilters, fetchProducts } from '../services/shop';

const DEFAULT_FILTERS: ProductFilters = { page: 1, pageSize: 12 };

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: filterOptions } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    staleTime: 5 * 60 * 1000,
  });

  const { data: pagedResult, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 60 * 1000,
  });

  const updateFilter = (updated: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated, page: 1 }));
  };

  const reset = () => {
    setFilters(DEFAULT_FILTERS);
    setKeyword('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ keyword: keyword || undefined });
  };

  return (
    <div className="shop-page">
      {/* Search bar */}
      <form className="shop-search-bar" onSubmit={handleSearch}>
        <input
          className="shop-search-input"
          placeholder="Input Wine Type, Varietal or Keyword, then enter to search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="shop-search-btn">🔍</button>
      </form>

      {/* Filter panel */}
      {filterOptions && (
        <FilterPanel
          options={filterOptions}
          filters={filters}
          onChange={updateFilter}
          onReset={reset}
        />
      )}

      {/* Results area */}
      <div className="shop-content">
        <div className="shop-main">
          <div className="shop-results-header">
            <div>
              <strong>Here are your search results.</strong>
              <span className="shop-subtext">
                {' '}For pricing and availability please reach out to your representative or contact our customer service team.
              </span>
            </div>
            <div className="shop-view-toggle">
              <button
                className={`shop-toggle-btn ${view === 'grid' ? 'shop-active-toggle' : ''}`}
                onClick={() => setView('grid')}
              >
                Grid
              </button>
              <button
                className={`shop-toggle-btn ${view === 'list' ? 'shop-active-toggle' : ''}`}
                onClick={() => setView('list')}
              >
                List
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="shop-loading">Loading...</div>
          ) : (
            <>
              <ProductGrid products={pagedResult?.items ?? []} view={view} />
              {/* Pagination */}
              {pagedResult && pagedResult.totalPages > 1 && (
                <div className="shop-pagination">
                  <button
                    disabled={!pagedResult.hasPrev}
                    onClick={() => updateFilter({ page: filters.page - 1 })}
                  >
                    ← Prev
                  </button>
                  <span>Page {pagedResult.page} / {pagedResult.totalPages}</span>
                  <button
                    disabled={!pagedResult.hasNext}
                    onClick={() => updateFilter({ page: filters.page + 1 })}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="shop-aside">
          <CartSidebar />
        </aside>
      </div>
    </div>
  );
}

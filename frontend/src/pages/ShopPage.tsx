import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import FilterPanel from '../components/shop/FilterPanel';
import ProductGrid from '../components/shop/ProductGrid';
import type { ProductFilters } from '../types';
import { fetchFilters, fetchProducts } from '../services/shop';
import { SearchIcon, GridIcon, ListIcon } from '../components/common/Icons';

const DEFAULT_FILTERS: ProductFilters = { page: 1, pageSize: 12 };

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { t } = useTranslation();

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
      <header className="shop-header">
        <h1 className="shop-title">{t('shop.title')}</h1>
        <p className="shop-subtitle">{t('shop.subtitle')}</p>
        
        <div className="search-container">
          <form className="shop-search-bar" onSubmit={handleSearch}>
            <SearchIcon className="search-icon" size={20} />
            <input
              className="shop-search-input"
              placeholder={t('shop.search_placeholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
      </header>

      <div className="shop-layout-container">
        <main className="shop-results-main">
          {filterOptions && (
            <div className="shop-filters-standalone">
              <FilterPanel
                options={filterOptions}
                filters={filters}
                onChange={updateFilter}
                onReset={reset}
              />
            </div>
          )}
          
          <div className="shop-toolbar">
            <div className="results-count">
              {t('shop.results_found', { count: pagedResult?.totalCount ?? 0 })}
            </div>
            <div className="shop-view-options">
              <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="Grid View"
              >
                <GridIcon size={20} />
              </button>
              <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List View"
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="shop-loading-state">
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
    </div>
  );
}

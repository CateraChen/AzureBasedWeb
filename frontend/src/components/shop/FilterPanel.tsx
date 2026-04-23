import React, { useState, useRef, useEffect } from 'react';
import type { FilterOptions, ProductFilters } from '../../types';
import { ChevronDownIcon, RotateCcwIcon, CheckIcon } from '../common/Icons';

interface Props {
  options: FilterOptions;
  filters: ProductFilters;
  onChange: (updated: Partial<ProductFilters>) => void;
  onReset: () => void;
}

const COLUMNS: { key: keyof Omit<ProductFilters, 'page' | 'pageSize' | 'keyword'>; label: string }[] = [
  { key: 'category', label: 'Category' },
  { key: 'style', label: 'Style' },
  { key: 'brand', label: 'Brand' },
  { key: 'designer', label: 'Designer' },
  { key: 'releaseYear', label: 'Release Year' },
];

export default function FilterPanel({ options, filters, onChange, onReset }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getOptions = (key: string): (string | number)[] => {
    switch (key) {
      case 'category': return options.categories;
      case 'style': return options.styles;
      case 'brand': return options.brands;
      case 'designer': return options.designers;
      case 'releaseYear': return options.releaseYears;
      default: return [];
    }
  };

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = COLUMNS.some(col => filters[col.key]);

  return (
    <div className="filter-wrapper" ref={containerRef}>
      <div className="filter-horizontal-row">
        <div className="filter-groups">
          {COLUMNS.map(({ key, label }) => {
            const opts = getOptions(key);
            const selectedValue = filters[key];
            const isActive = !!selectedValue;

            return (
              <div key={key} className={`filter-dropdown-container ${activeDropdown === key ? 'is-open' : ''}`}>
                <button
                  className={`filter-dropdown-trigger ${isActive ? 'has-value' : ''}`}
                  onClick={() => toggleDropdown(key)}
                >
                  <span className="filter-label">{label}</span>
                  {isActive && <span className="filter-selected-val">: {selectedValue}</span>}
                  <ChevronDownIcon size={14} className="dropdown-arrow" />
                </button>

                {activeDropdown === key && (
                  <div className="filter-dropdown-menu">
                    <div
                      key="show-all"
                      className={`filter-menu-item ${!selectedValue ? 'is-selected' : ''}`}
                      onClick={() => {
                        onChange({ [key]: undefined });
                        setActiveDropdown(null);
                      }}
                    >
                      <span>Show All</span>
                      {!selectedValue && <CheckIcon size={14} />}
                    </div>
                    {opts.map((opt) => (
                      <div
                        key={opt}
                        className={`filter-menu-item ${selectedValue === opt ? 'is-selected' : ''}`}
                        onClick={() => {
                          onChange({ [key]: opt as never });
                          setActiveDropdown(null);
                        }}
                      >
                        <span>{opt}</span>
                        {selectedValue === opt && <CheckIcon size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button className="filter-clear-all" onClick={onReset}>
            <RotateCcwIcon size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filter-pills">
          {COLUMNS.map(col => {
            const val = filters[col.key];
            if (!val) return null;
            return (
              <div key={col.key} className="filter-pill" onClick={() => onChange({ [col.key]: undefined })}>
                <span className="pill-category">{col.label}:</span>
                <span className="pill-value">{val}</span>
                <span className="pill-remove">×</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


import type { FilterOptions, ProductFilters } from '../../types';

interface Props {
  options: FilterOptions;
  filters: ProductFilters;
  onChange: (updated: Partial<ProductFilters>) => void;
  onReset: () => void;
}

const COLUMNS: { key: keyof Omit<ProductFilters, 'page' | 'pageSize' | 'keyword'>; label: string }[] = [
  { key: 'wineType', label: 'Wine Type' },
  { key: 'varietal', label: 'Varietal' },
  { key: 'region', label: 'Region' },
  { key: 'winery', label: 'Winery' },
  { key: 'vintage', label: 'Vintage' },
];

export default function FilterPanel({ options, filters, onChange, onReset }: Props) {
  const getOptions = (key: string): (string | number)[] => {
    switch (key) {
      case 'wineType': return options.wineTypes;
      case 'varietal': return options.varietals;
      case 'region': return options.regions;
      case 'winery': return options.wineries;
      case 'vintage': return options.vintages;
      default: return [];
    }
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-columns">
        {COLUMNS.map(({ key, label }) => {
          const opts = getOptions(key);
          const selected = filters[key];
          return (
            <div key={key} className="filter-column">
              <div className="filter-header">{label}</div>
              <div className="filter-list">
                <div
                  className={`filter-item ${!selected ? 'filter-active' : ''}`}
                  onClick={() => onChange({ [key]: undefined })}
                >
                  Show All
                </div>
                {opts.map((opt) => (
                  <div
                    key={opt}
                    className={`filter-item ${selected == opt ? 'filter-active' : ''}`}
                    onClick={() => onChange({ [key]: opt as never })}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="filter-footer">
        <button className="filter-reset-btn" onClick={onReset}>Reset Filters</button>
      </div>
    </div>
  );
}

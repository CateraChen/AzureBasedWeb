import type { ProductSummary } from '../../types';
import ProductCard from './ProductCard';

interface Props {
  products: ProductSummary[];
  view: 'grid' | 'list';
}

export default function ProductGrid({ products, view }: Props) {
  if (products.length === 0) {
    return <div className="pg-empty">No products found. Try adjusting the filters.</div>;
  }

  return (
    <div className={view === 'grid' ? 'pg-grid' : 'pg-list'}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} view={view} />
      ))}
    </div>
  );
}

import { useRef } from 'react';
import type { ProductSummary } from '../../types';
import ProductCard from './ProductCard';

interface Props {
  products: ProductSummary[];
}

export default function RecommendationCarousel({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 250 : -250, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Customers Also Bought This</h2>
      <div className="carousel-wrapper">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scroll('left')}>‹</button>
        <div className="carousel-track" ref={scrollRef}>
          {products.map((p) => (
            <div key={p.id} className="carousel-item">
              <ProductCard product={p} view="grid" />
            </div>
          ))}
        </div>
        <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { ProductSummary } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface Props {
  product: ProductSummary;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: Props) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { add } = useCart();

  const handleAdd = async () => {
    setAdding(true);
    try {
      await add(product.id, qty);
    } finally {
      setAdding(false);
    }
  };

  const statusClass =
    product.availabilityStatus === 'Available'
      ? 'pc-available'
      : product.availabilityStatus === 'LowStock'
      ? 'pc-low-stock'
      : 'pc-out-of-stock';

  const statusLabel =
    product.availabilityStatus === 'Available'
      ? 'Available for Shipping'
      : product.availabilityStatus === 'LowStock'
      ? 'Low Stock Order Now'
      : 'Out of Stock';

  if (view === 'list') {
    return (
      <div className="pc-list-card">
        <div className="pc-list-img">
          {product.stockCases <= 3 && product.stockCases > 0 && (
            <div className="pc-badge-overlay">{product.stockCases} CASES LEFT</div>
          )}
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} />
            : <div className="pc-placeholder" />}
        </div>
        <div className="pc-list-body">
          <h3 className="pc-name">{product.name}</h3>
          <p className="pc-volume">{product.volume}</p>
          {product.deals.map((d) => <p key={d} className="pc-deal">{d}</p>)}
          <div className={`pc-status ${statusClass}`}>{statusLabel}</div>
          <div className="pc-add-row">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="pc-qty-input"
            />
            <span className="pc-qty-label">Case(s)</span>
            <button className="pc-add-btn" onClick={handleAdd} disabled={adding}>
              {adding ? 'Adding...' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pc-card">
      {product.stockCases > 0 && product.stockCases <= 3 && (
        <div className="pc-badge-overlay">{product.stockCases} CASES LEFT</div>
      )}
      <button className="pc-wish-btn" aria-label="Wishlist">☆</button>
      <div className="pc-img-wrap">
        {product.ratingScore && (
          <div className="pc-rating-badge">{product.ratingScore}</div>
        )}
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} className="pc-img" />
          : <div className="pc-no-img" />}
      </div>
      <h3 className="pc-name">{product.name}</h3>
      <p className="pc-volume">{product.volume}</p>
      {product.deals.map((d) => <p key={d} className="pc-deal">{d}</p>)}
      <div className={`pc-status ${statusClass}`}>{statusLabel}</div>
      <div className="pc-add-row">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="pc-qty-input"
        />
        <span className="pc-qty-label">Case(s)</span>
      </div>
      <button className="pc-add-btn" onClick={handleAdd} disabled={adding}>
        {adding ? 'Adding...' : 'ADD TO CART'}
      </button>
    </div>
  );
}

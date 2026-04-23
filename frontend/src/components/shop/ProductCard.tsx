import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductSummary } from '../../types';
import { useCart } from '../../contexts/useCart';
import { StarIcon, ShirtIcon } from '../common/Icons';

interface Props {
  product: ProductSummary;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: Props) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { t } = useTranslation();
  const { add } = useCart();
  const imageUrl = product.imageUrl ?? undefined;
  const hasImage = Boolean(product.imageUrl) && !imageFailed;

  const metaTags = [product.brand, product.designer, product.releaseYear ? String(product.releaseYear) : null]
    .filter(Boolean) as string[];

  const shirtFallback = (
    <div className="pc-no-img">
      <div className="pc-no-img-shell">
        <ShirtIcon size={86} />
      </div>
      <span className="pc-no-img-text">{t('product.card.artwork')}</span>
    </div>
  );

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
      ? t('product.card.status.available')
      : product.availabilityStatus === 'LowStock'
      ? t('product.card.status.lowStock')
      : t('product.card.status.soldOut');

  if (view === 'list') {
    return (
      <div className="pc-list-card">
        <div className="pc-list-img">
          {product.stockCases <= 5 && product.stockCases > 0 && (
            <div className="pc-badge-overlay">{t('product.card.left', { count: product.stockCases })}</div>
          )}
          {hasImage ? (
            <img
              src={imageUrl}
              alt={product.name}
              onError={() => setImageFailed(true)}
            />
          ) : (
            shirtFallback
          )}
        </div>
        <div className="pc-list-body">
          <div className="pc-list-header">
            <div>
              <p className="pc-eyebrow">{product.category}</p>
              <h3 className="pc-name">{product.name}</h3>
            </div>
            <div className={`pc-status pc-status-inline ${statusClass}`}>{statusLabel}</div>
          </div>
          <div className="pc-meta-row">
            {metaTags.map((tag) => (
              <span key={tag} className="pc-meta-chip">{tag}</span>
            ))}
          </div>
          <p className="pc-volume">{product.sizeRange}</p>
          <div className="pc-deal-list">
            {product.deals.map((d) => <span key={d} className="pc-deal">{d}</span>)}
          </div>
          <div className="pc-list-footer">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="pc-qty-input"
            />
            <span className="pc-qty-label">{t('product.card.quantity')}</span>
            <button className="pc-add-btn" onClick={handleAdd} disabled={adding}>
              {adding ? t('product.card.adding') : t('product.card.addToBag')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pc-card">
      {product.stockCases > 0 && product.stockCases <= 5 && (
        <div className="pc-badge-overlay">{t('product.card.left', { count: product.stockCases })}</div>
      )}
      <button className="pc-wish-btn" aria-label="Wishlist">
        <StarIcon size={18} />
      </button>
      <div className="pc-img-wrap">
        {product.ratingScore && (
          <div className="pc-rating-badge">{product.ratingScore}</div>
        )}
        {hasImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="pc-img"
            onError={() => setImageFailed(true)}
          />
        ) : (
          shirtFallback
        )}
      </div>
      <div className="pc-card-copy">
        <p className="pc-eyebrow">{product.category} · {product.brand}</p>
        <h3 className="pc-name">{product.name}</h3>
        <div className="pc-meta-row">
          {metaTags.map((tag) => (
            <span key={tag} className="pc-meta-chip">{tag}</span>
          ))}
        </div>
      </div>
      <p className="pc-volume">{product.sizeRange}</p>
      <div className="pc-deal-list">
        {product.deals.map((d) => <span key={d} className="pc-deal">{d}</span>)}
      </div>
      <div className={`pc-status ${statusClass}`}>{statusLabel}</div>
      <div className="pc-add-row">
        <div className="pc-qty-wrapper">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="pc-qty-input"
          />
          <span className="pc-qty-label">{t('product.card.qty')}</span>
        </div>
        <button className="pc-add-btn" onClick={handleAdd} disabled={adding || product.stockCases === 0}>
          {product.stockCases === 0 ? t('product.card.soldOut') : adding ? t('product.card.adding') : t('product.card.addToBag')}
        </button>
      </div>
    </div>
  );
}

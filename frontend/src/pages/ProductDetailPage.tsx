import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import GlassCard from '../components/common/GlassCard';


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  // In a real app, we'd fetch product by ID. 
  // For now, we'll mock a product based on the context of WanJiaDengHuo.
  const product = {
    id: Number(id),
    name: "WANJIA SIGNATURE SILK SHIRT",
    style: "Elegance Collection",
    material: "100% Mulberry Silk",
    color: "Moonlight Silver",
    price: 1280.00,
    inventoryCount: 3,
    description: "A timeless piece blending traditional craftsmanship with modern silhouettes. Each WanJia Signature item represents our commitment to light and home.",
    sizeRange: "S, M, L, XL"
  };

  const handleAddToBag = async () => {
    setAdding(true);
    try {
      await add(String(product.id), 1);
    } finally {
      setTimeout(() => setAdding(false), 800);
    }
  };

  return (
    <div className="product-detail-page bg-dark text-white">
      <div className="container py-5">
        <div className="mb-5">
          <Link to="/shop" className="back-link">
            ← {t('product.back_to_shop')}
          </Link>
        </div>

        <div className="row g-5 align-items-center">
          {/* Product Image Section */}
          <div className="col-lg-7">
            <GlassCard intensity="strong" className="detail-image-card">
              <div className="shirt-artwork">
                <svg width="400" height="400" viewBox="0 0 100 100">
                   <path d="M50 15 L75 25 L85 45 L75 45 L75 85 L25 85 L25 45 L15 45 L25 25 Z" 
                         fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" id="shirt-path" />
                   <text x="50" y="55" textAnchor="middle" fontSize="4" fill="currentColor" fillOpacity="0.5">
                     WANJIA LIGHTS
                   </text>
                </svg>
              </div>
            </GlassCard>
          </div>

          {/* Product Info Section */}
          <div className="col-lg-5">
            <div className="detail-info-card">
               <h3 className="brand-label text-gold uppercase">{product.style}</h3>
               <h1 className="product-display-name">{product.name}</h1>
               <div className="price-tag mb-4">¥ {product.price.toLocaleString()}</div>
               
               <p className="product-desc mb-5">{product.description}</p>

               <div className="product-meta-grid mb-5">
                  <div className="meta-item">
                     <span className="meta-label">{t('product.material')}</span>
                     <span className="meta-value">{product.material}</span>
                  </div>
                  <div className="meta-item">
                     <span className="meta-label">{t('product.color')}</span>
                     <span className="meta-value">{product.color}</span>
                  </div>
                  <div className="meta-item">
                     <span className="meta-label">{t('product.size')}</span>
                     <span className="meta-value">{product.sizeRange}</span>
                  </div>
               </div>

               <div className="add-action-area">
                  <div className="stock-info mb-3">
                     {product.inventoryCount <= 5 ? (
                        <span className="text-warning-glow">● {t('product.card.left', { count: product.inventoryCount })}</span>
                     ) : (
                        <span className="text-success-glow">● {t('product.card.status.available')}</span>
                     )}
                  </div>
                  
                  <button 
                    className={`btn-glamorous w-100 ${adding ? 'adding' : ''}`}
                    onClick={handleAddToBag}
                    disabled={adding}
                  >
                    {adding ? t('product.card.adding') : t('product.card.addToBag')}
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
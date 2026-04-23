import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/useCart';
import { CartIcon, XIcon } from '../common/Icons';

export default function CartSidebar() {
  const { cart, loading, remove, clear } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        className="cart-toggle-floating" 
        onClick={toggleDrawer}
        aria-label="Toggle Cart"
      >
        <CartIcon className="cart-icon" size={24} />
        {cart.totalItems > 0 && (
          <span className="cart-count">{cart.totalItems}</span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={toggleDrawer}></div>}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>{t('cart.title')}</h3>
          <button className="close-btn" onClick={toggleDrawer}>
            <XIcon size={24} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.items.length === 0 ? (
            <div className="cart-empty">
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-drawer-item">
                  <div className="item-info">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-details">{item.sizeRange}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-qty">×{item.quantity}</span>
                    <button
                      className="remove-btn"
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-summary">
            <span>{t('cart.total_items')}</span>
            <span>{cart.totalItems}</span>
          </div>
          <div className="footer-actions">
            <button 
              className="checkout-btn" 
              disabled={cart.items.length === 0}
            >
              {t('cart.checkout')}
            </button>
            <button 
              className="clear-all-btn" 
              onClick={clear} 
              disabled={loading || cart.items.length === 0}
            >
              {t('cart.clear')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


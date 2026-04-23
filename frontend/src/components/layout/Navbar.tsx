import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { ShirtIcon, GlobeIcon, StarIcon, UserIcon, CartIcon } from '../common/Icons';

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(nextLng);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-box">
            <ShirtIcon size={28} className="navbar-logo-icon" />
            <div className="navbar-logo-brand">
              <span className="navbar-logo-text">{t('brand.name')}</span>
              <span className="navbar-logo-sub">{t('brand.subtitle')}</span>
            </div>
          </div>
        </Link>
        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar-active' : ''}>{t('nav.home')}</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'navbar-active' : ''}>{t('nav.shop')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'navbar-active' : ''}>{t('nav.about')}</NavLink>
          <NavLink to="/promotions" className={({ isActive }) => isActive ? 'navbar-active' : ''}>{t('nav.promotions')}</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar-active' : ''}>{t('nav.contact')}</NavLink>
        </nav>
        <div className="navbar-icons">
          <button className="navbar-icon-btn" aria-label="Language" onClick={toggleLanguage} title={i18n.language.startsWith('zh') ? 'Switch to English' : '切换为中文'}>
            <GlobeIcon size={20} />
          </button>
          <button className="navbar-icon-btn" aria-label="Wishlist">
            <StarIcon size={20} />
          </button>
          <button className="navbar-icon-btn" aria-label="Account" title={user?.email}>
            {user ? user.firstName[0] : <UserIcon size={20} />}
          </button>
          <Link to="/shop" className="navbar-cart-icon" aria-label="Cart">
            <CartIcon size={20} />
            {cart.totalItems > 0 && (
              <span className="navbar-cart-badge">{cart.totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

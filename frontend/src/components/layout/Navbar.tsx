import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-box">
            <span className="navbar-logo-text">COMPANY</span>
            <span className="navbar-logo-sub">WINE STORE</span>
          </div>
        </Link>
        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar-active' : ''}>HOME</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'navbar-active' : ''}>SHOP</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'navbar-active' : ''}>ABOUT US</NavLink>
          <NavLink to="/promotions" className={({ isActive }) => isActive ? 'navbar-active' : ''}>PROMOTIONS</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar-active' : ''}>CONTACT</NavLink>
        </nav>
        <div className="navbar-icons">
          <button className="navbar-icon-btn" aria-label="Language">🌐</button>
          <button className="navbar-icon-btn" aria-label="Wishlist">☆</button>
          <button className="navbar-icon-btn" aria-label="Account" title={user?.email}>
            {user ? user.firstName[0] : '👤'}
          </button>
          <Link to="/shop" className="navbar-cart-icon" aria-label="Cart">
            🛒
            {cart.totalItems > 0 && (
              <span className="navbar-cart-badge">{cart.totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

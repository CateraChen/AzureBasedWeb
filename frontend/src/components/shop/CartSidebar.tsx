import { useCart } from '../../contexts/CartContext';

export default function CartSidebar() {
  const { cart, loading, remove, clear } = useCart();

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        🛒 Shopping Cart: {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}
      </div>
      <div className="cart-body">
        {cart.items.length === 0 ? (
          <p className="cart-empty">Empty Cart</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.productName}</span>
                <span className="cart-item-vol">{item.volume}</span>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-qty">×{item.quantity}</span>
                <button
                  className="cart-remove-btn"
                  onClick={() => remove(item.id)}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <button className="cart-btn">Shopping Cart</button>
        <button className="cart-clear-btn" onClick={clear} disabled={loading || cart.items.length === 0}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

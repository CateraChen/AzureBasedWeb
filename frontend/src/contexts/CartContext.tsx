import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import type { Cart } from '../types';
import { addToCart, clearCart, fetchCart, removeCartItem } from '../services/cart';

interface CartState {
  cart: Cart;
  loading: boolean;
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean };

const initial: CartState = {
  cart: { items: [], totalItems: 0 },
  loading: false,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': return { ...state, cart: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    default: return state;
  }
}

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  add: (productId: string, quantity: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const refresh = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await fetchCart();
      dispatch({ type: 'SET_CART', payload: cart });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = useCallback(async (productId: string, quantity: number) => {
    const cart = await addToCart(productId, quantity);
    dispatch({ type: 'SET_CART', payload: cart });
  }, []);

  const remove = useCallback(async (itemId: string) => {
    await removeCartItem(itemId);
    await refresh();
  }, [refresh]);

  const clear = useCallback(async () => {
    await clearCart();
    dispatch({ type: 'SET_CART', payload: { items: [], totalItems: 0 } });
  }, []);

  return (
    <CartContext.Provider value={{ cart: state.cart, loading: state.loading, add, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

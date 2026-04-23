import { createContext } from 'react';
import type { Cart } from '../types';

export interface CartContextValue {
  cart: Cart;
  loading: boolean;
  add: (productId: string, quantity: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);
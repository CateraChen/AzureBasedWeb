import type { Cart } from '../types';
import api from './apiClient';

function ensureSessionId(): string {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('sessionId', id);
  }
  return id;
}

export async function fetchCart(): Promise<Cart> {
  ensureSessionId();
  const { data } = await api.get('/api/cart');
  return data;
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  ensureSessionId();
  const { data } = await api.post('/api/cart/items', { productId, quantity });
  return data;
}

export async function removeCartItem(itemId: string): Promise<void> {
  await api.delete(`/api/cart/items/${itemId}`);
}

export async function clearCart(): Promise<void> {
  await api.delete('/api/cart');
}

export async function mergeGuestCart(sessionId: string): Promise<void> {
  await api.post('/api/cart/merge', { sessionId });
}

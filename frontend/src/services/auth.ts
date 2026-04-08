import type { AuthResponse } from '../types';
import api from './apiClient';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/register', { email, password, firstName, lastName });
  return data;
}

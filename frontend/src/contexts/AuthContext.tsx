import React, { createContext, useCallback, useContext, useState } from 'react';
import type { AuthResponse } from '../types';
import * as authService from '../services/auth';
import { mergeGuestCart } from '../services/cart';

interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function storeAuth(auth: AuthResponse) {
  localStorage.setItem('accessToken', auth.accessToken);
  localStorage.setItem('refreshToken', auth.refreshToken);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { email: payload.email, firstName: '', lastName: '' };
    } catch {
      return null;
    }
  });

  const handleAuth = useCallback(async (auth: AuthResponse) => {
    storeAuth(auth);
    setUser({ email: auth.email, firstName: auth.firstName, lastName: auth.lastName });

    // merge guest cart on login
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      try {
        await mergeGuestCart(sessionId);
      } catch {
        // non-critical
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = await authService.login(email, password);
    await handleAuth(auth);
  }, [handleAuth]);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const auth = await authService.register(email, password, firstName, lastName);
    await handleAuth(auth);
  }, [handleAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

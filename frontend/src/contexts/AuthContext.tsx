import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('stellar_token');
    const storedUser = localStorage.getItem('stellar_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('stellar_token');
        localStorage.removeItem('stellar_user');
        localStorage.removeItem('stellar_refresh_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, refreshToken: string, newUser: User) => {
    localStorage.setItem('stellar_token', newToken);
    localStorage.setItem('stellar_refresh_token', refreshToken);
    localStorage.setItem('stellar_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('stellar_token');
    localStorage.removeItem('stellar_refresh_token');
    localStorage.removeItem('stellar_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

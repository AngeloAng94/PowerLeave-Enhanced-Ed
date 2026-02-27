import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import api, { API_URL } from '../lib/api';
import { NotificationService } from './NotificationContext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      // Check auth via HttpOnly cookie (no localStorage)
      const userData = await api.get('/api/auth/me');
      setUser(userData);
      NotificationService.init();
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password });
    setUser(data);
    NotificationService.init();
    return data;
  };

  const register = async (email, name, password, organizationName) => {
    const data = await api.post('/api/auth/register', {
      email, name, password, organization_name: organizationName,
    });
    setUser(data);
    NotificationService.init();
    return data;
  };

  const logout = async () => {
    try { await api.post('/api/auth/logout', {}); } catch {}
    setUser(null);
    window.location.hash = '';
  };

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const loginWithGoogle = () => {
    const redirectUrl = `${window.location.origin}/#/auth/callback`;
    window.location.href = `https://auth.emergentapi.com/api/auth/google?redirect_url=${encodeURIComponent(redirectUrl)}&app_name=PowerLeave`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

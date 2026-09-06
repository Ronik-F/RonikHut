'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email, password, role = 'customer') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      addToast(`Welcome back, ${data.user.name}!`, 'success');

      if (data.user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/');
      }

      return { success: true, user: data.user };
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
      return { success: false, error: error.message };
    }
  };

  const register = async ({ name, email, password, phone, role = 'customer' }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      addToast(`Account created! Welcome to RonyCafeHut, ${data.user.name}!`, 'success');

      if (data.user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/menu');
      }

      return { success: true, user: data.user };
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      addToast('You have been signed out', 'info');
      router.push('/');
    } catch (err) {
      setUser(null);
      router.push('/');
    }
  };

  const isOwner = user?.role === 'owner';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOwner,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser: fetchSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

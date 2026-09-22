import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI, adminAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clothifyUser')); } catch { return null; }
  });
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clothifyAdmin')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // ── Customer ──────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem('clothifyUser', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome to Clothify, ${data.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('clothifyUser', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('clothifyUser');
    setUser(null);
    toast.info('Logged out successfully');
    // Force immediate redirect
    window.location.href = '/';
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(profileData);
      const updated = { ...user, ...data };
      localStorage.setItem('clothifyUser', JSON.stringify(updated));
      setUser(updated);
      toast.success('Profile updated!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── Admin ──────────────────────────────────────────────────────
  const adminLogin = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.login({ email, password });
      localStorage.setItem('clothifyAdmin', JSON.stringify(data));
      setAdmin(data);
      toast.success(`Welcome, Admin ${data.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('clothifyAdmin');
    setAdmin(null);
    toast.info('Admin logged out');
  }, []);

  return (
    <AuthContext.Provider value={{
      user, admin, loading,
      register, login, logout,
      adminLogin, adminLogout, updateProfile,
      isAuth: !!user,
      isAdmin: !!admin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

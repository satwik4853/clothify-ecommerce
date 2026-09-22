import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuth } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Derived values
  const cartCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = cartSubtotal >= 999 ? 0 : 99;
  const cartTotal = cartSubtotal + shippingPrice;

  // Fetch cart from server when user logs in
  const fetchCart = useCallback(async () => {
    if (!isAuth) { setCart({ items: [] }); return; }
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data.cart || { items: [] });
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId, size, color, quantity = 1) => {
    if (!isAuth) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }
    setLoading(true);
    try {
      const { data } = await cartAPI.add({ productId, size, color, quantity });
      setCart(data.cart);
      toast.success('Added to cart!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  const updateItem = useCallback(async (itemId, quantity) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.update(itemId, quantity);
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.remove(itemId);
      setCart(data.cart);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch { /* ignore */ }
  }, []);

  return (
    <CartContext.Provider value={{
      cart, loading, cartCount, cartSubtotal, shippingPrice, cartTotal,
      fetchCart, addToCart, updateItem, removeItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

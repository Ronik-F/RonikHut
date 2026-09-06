'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './toastContext';

const CartContext = createContext(null);

const STORAGE_KEY = 'ronycafehut_cart_v1';
const TAX_RATE = 0.0825; // 8.25%
const STANDARD_DELIVERY_FEE = 3.50;
const FREE_DELIVERY_THRESHOLD = 45.00;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null); // e.g. { code: 'COZY20', percent: 20 }
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway' | 'delivery'
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isLoaded]);

  const generateCartItemId = (itemId, customization = {}) => {
    const customKey = Object.entries(customization)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    return `${itemId}_${customKey}`;
  };

  const calculateCustomizationExtra = (customization = {}) => {
    let extra = 0;
    Object.values(customization).forEach(val => {
      if (typeof val === 'string') {
        const match = val.match(/\+\$?([0-9.]+)/);
        if (match && match[1]) {
          extra += parseFloat(match[1]);
        }
      }
    });
    return extra;
  };

  const addToCart = useCallback((menuItem, quantity = 1, customization = {}, notes = '') => {
    const extraPrice = calculateCustomizationExtra(customization);
    const unitPrice = menuItem.price + extraPrice;
    const cartItemId = generateCartItemId(menuItem.id, customization);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice,
          itemTotal: Number((unitPrice * newQty).toFixed(2)),
          notes: notes || updated[existingIndex].notes
        };
        return updated;
      } else {
        const newItem = {
          cartItemId,
          id: menuItem.id,
          name: menuItem.name,
          basePrice: menuItem.price,
          unitPrice,
          image: menuItem.image,
          category: menuItem.category,
          quantity,
          customization,
          notes,
          itemTotal: Number((unitPrice * quantity).toFixed(2))
        };
        return [...prevItems, newItem];
      }
    });

    addToast(`Added "${menuItem.name}" to your order!`, 'success');
  }, [addToast]);

  const updateQuantity = useCallback((cartItemId, delta) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            itemTotal: Number((item.unitPrice * newQty).toFixed(2))
          };
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setItems(prevItems => prevItems.filter(i => i.cartItemId !== cartItemId));
    addToast('Item removed from cart', 'info');
  }, [addToast]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, []);

  const applyCoupon = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'COZY20') {
      setCoupon({ code: 'COZY20', percent: 20, description: '20% Off Cozy Special' });
      addToast('Promo code applied: 20% discount!', 'success');
      return { success: true, message: '20% discount applied' };
    } else if (cleanCode === 'COFFEE10') {
      setCoupon({ code: 'COFFEE10', percent: 10, description: '10% Off Coffee Lovers' });
      addToast('Promo code applied: 10% discount!', 'success');
      return { success: true, message: '10% discount applied' };
    } else {
      addToast('Invalid promo code. Try "COZY20"', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Promo code removed', 'info');
  };

  // Computations
  const itemCount = items.reduce((acc, cur) => acc + cur.quantity, 0);
  const subtotal = Number(items.reduce((acc, cur) => acc + (cur.unitPrice * cur.quantity), 0).toFixed(2));
  
  const discount = coupon ? Number(((subtotal * coupon.percent) / 100).toFixed(2)) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const deliveryFee = orderType === 'delivery'
    ? (discountedSubtotal >= FREE_DELIVERY_THRESHOLD || discountedSubtotal === 0 ? 0 : STANDARD_DELIVERY_FEE)
    : 0;

  const tax = Number((discountedSubtotal * TAX_RATE).toFixed(2));
  const total = Number((discountedSubtotal + tax + deliveryFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
        coupon,
        orderType,
        tableNumber,
        isCartOpen,
        setIsCartOpen,
        setOrderType,
        setTableNumber,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

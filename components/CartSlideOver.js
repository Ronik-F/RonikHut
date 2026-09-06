'use client';

import React from 'react';
import Link from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, UtensilsCrossed, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartSlideOver() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    tax,
    deliveryFee,
    total,
    coupon,
    orderType,
    setOrderType,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = React.useState('');
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleViewCartClick = () => {
    setIsCartOpen(false);
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-cafe-950/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-cream-50 flex flex-col shadow-warm-xl border-l border-cafe-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-cafe-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cafe-100 flex items-center justify-center text-cafe-800">
                  <ShoppingBag className="w-5 h-5 text-cafe-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-cafe-900">Your Order</h2>
                  <p className="text-xs text-cafe-600 font-medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-cafe-600 hover:text-cafe-900 hover:bg-cafe-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Type Toggle */}
            <div className="px-6 py-3 bg-cafe-100/60 border-b border-cafe-200/60">
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-cafe-200/80 text-xs font-semibold">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`py-1.5 rounded-lg transition-all ${
                    orderType === 'dine-in'
                      ? 'bg-cafe-800 text-cream-100 shadow-sm'
                      : 'text-cafe-700 hover:text-cafe-900'
                  }`}
                >
                  Dine-In
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`py-1.5 rounded-lg transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-cafe-800 text-cream-100 shadow-sm'
                      : 'text-cafe-700 hover:text-cafe-900'
                  }`}
                >
                  Takeaway
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`py-1.5 rounded-lg transition-all ${
                    orderType === 'delivery'
                      ? 'bg-cafe-800 text-cream-100 shadow-sm'
                      : 'text-cafe-700 hover:text-cafe-900'
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-cafe-100 flex items-center justify-center mb-4 text-cafe-400">
                    <UtensilsCrossed className="w-9 h-9" />
                  </div>
                  <h3 className="text-lg font-bold text-cafe-900 mb-1">Your table is waiting</h3>
                  <p className="text-sm text-cafe-600 max-w-xs mb-6">
                    Warm coffee and fresh pastries are just a few clicks away.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/menu');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cafe-800 text-cream-100 text-sm font-semibold hover:bg-cafe-900 transition-all shadow-warm-sm"
                  >
                    Explore Menu <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    key={item.cartItemId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-2xl bg-white border border-cafe-200/80 shadow-warm-sm flex gap-3.5 items-start"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cafe-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-cafe-900 truncate">{item.name}</h4>
                        <span className="text-sm font-bold text-cafe-800">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Customizations pill list */}
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.customization).map(([k, val]) => (
                            <span
                              key={k}
                              className="text-[11px] font-medium bg-cafe-100/90 text-cafe-700 px-2 py-0.5 rounded-md"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-[11px] text-cafe-500 italic mt-0.5 truncate">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-cafe-50 border border-cafe-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-cafe-700 hover:bg-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-cafe-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-cafe-700 hover:bg-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-cafe-400 hover:text-terracotta transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-cafe-200/80 shadow-lg space-y-4">
                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-cafe-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code (Try COZY20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-cafe-50 border border-cafe-200 rounded-xl focus:outline-none focus:border-cafe-600 text-cafe-900"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (couponInput) {
                        applyCoupon(couponInput);
                        setCouponInput('');
                      }
                    }}
                    className="px-4 py-2 bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {coupon && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-sage-50 border border-sage-100 text-xs text-sage-700 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sage-500" /> {coupon.description}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-terracotta hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-cafe-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-cafe-900 font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sage-700">
                      <span>Discount ({coupon.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>
                  )}
                  <div className="border-t border-cafe-200 pt-2 flex justify-between text-base font-bold text-cafe-900">
                    <span>Total</span>
                    <span className="text-cafe-800">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleViewCartClick}
                    className="w-full py-3 px-4 rounded-xl border border-cafe-300 text-cafe-800 hover:bg-cafe-50 font-semibold text-xs transition-colors text-center"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3 px-4 rounded-xl bg-cafe-800 hover:bg-cafe-900 text-cream-100 font-semibold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

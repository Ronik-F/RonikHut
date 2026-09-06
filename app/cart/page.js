'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Tag,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartPage() {
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
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-[2.5rem] p-10 sm:p-16 border border-cafe-200/80 shadow-warm-md space-y-5 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-cafe-100 flex items-center justify-center mx-auto text-cafe-400">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cafe-950">
            Your table is waiting.
          </h1>
          <p className="text-xs sm:text-sm text-cafe-600 leading-relaxed">
            Your order is currently empty. Explore our freshly brewed single-origin coffees, woodfired pizzas, and warm bakery pastries.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cafe-900 hover:bg-cafe-800 text-cream-100 font-bold text-xs transition-all shadow-warm-md"
            >
              <span>Explore the Menu</span>
              <ArrowRight className="w-4 h-4 text-caramel-light" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cafe-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Review Selection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cafe-950 tracking-tight">
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Order Type Toggle */}
          <div className="p-4 rounded-2xl bg-white border border-cafe-200/80 shadow-warm-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-cafe-800">Dining Preference:</span>
            <div className="grid grid-cols-3 gap-1 bg-cafe-100/70 p-1 rounded-xl w-full sm:w-80 text-xs font-bold">
              {['dine-in', 'takeaway', 'delivery'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`py-2 rounded-lg capitalize transition-all ${
                    orderType === type
                      ? 'bg-cafe-900 text-cream-100 shadow-sm'
                      : 'text-cafe-700 hover:text-cafe-900'
                  }`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Items Container */}
          <div className="space-y-3">
            {items.map((item) => (
              <motion.div
                layout
                key={item.cartItemId}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cafe-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-cafe-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-caramel">
                      ${item.unitPrice.toFixed(2)} each
                    </p>

                    {/* Customizations */}
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {Object.entries(item.customization).map(([k, val]) => (
                          <span
                            key={k}
                            className="text-[11px] font-semibold bg-cafe-50 text-cafe-700 px-2 py-0.5 rounded-md border border-cafe-200"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-cafe-500 italic">
                        Note: "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Quantity Stepper, Item Total, and Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-cafe-100">
                  {/* Stepper */}
                  <div className="flex items-center gap-2 bg-cafe-50 border border-cafe-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-cafe-800 hover:bg-cafe-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-cafe-900 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-cafe-800 hover:bg-cafe-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-bold text-cafe-900 min-w-[70px] text-right">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-cafe-400 hover:text-terracotta transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold text-cafe-800 hover:text-caramel transition-colors"
            >
              <Plus className="w-4 h-4" /> Add more items from menu
            </Link>
          </div>
        </div>

        {/* Right Column: Summary & Checkout */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-[2rem] bg-white border border-cafe-200/80 shadow-warm-md space-y-6">
            <h2 className="text-lg font-bold text-cafe-950 border-b border-cafe-100 pb-3">
              Order Breakdown
            </h2>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-cafe-600">
                Promotional Voucher
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-cafe-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. COZY20"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs uppercase bg-cafe-50 border border-cafe-200 rounded-xl focus:outline-none focus:border-cafe-600 text-cafe-900 font-semibold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (couponCodeInput) {
                      applyCoupon(couponCodeInput);
                      setCouponCodeInput('');
                    }
                  }}
                  className="px-4 py-2.5 bg-cafe-900 hover:bg-cafe-800 text-cream-100 text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>

              {coupon && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-sage-50 border border-sage-200 text-xs text-sage-700 font-semibold mt-2">
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
            </div>

            {/* Calculations Table */}
            <div className="space-y-2 text-xs text-cafe-600 border-t border-cafe-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-cafe-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sage-700 font-bold">
                  <span>Discount ({coupon.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
              )}
              <div className="border-t border-cafe-200 pt-3 flex justify-between text-lg font-extrabold text-cafe-950">
                <span>Estimated Total</span>
                <span className="text-cafe-800">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-4 rounded-2xl bg-cafe-900 hover:bg-cafe-800 text-cream-100 font-bold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-caramel-light group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-cafe-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
              <span>Prepared fresh upon kitchen confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

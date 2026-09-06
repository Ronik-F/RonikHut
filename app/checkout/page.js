'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CreditCard,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Utensils,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/lib/toastContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
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
    clearCart
  } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple-pay' | 'counter-cash'

  // Card details state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('892');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [items, isSubmitting, router]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim()) {
      addToast('Please enter a valid contact phone number', 'error');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      addToast('Please provide a delivery street address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user ? user.id : null,
        customer: {
          name: name.trim(),
          email: email.trim() || 'guest@ronycafehut.com',
          phone: phone.trim(),
          type: orderType,
          tableNumber: orderType === 'dine-in' ? tableNumber : '',
          deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : ''
        },
        items: items.map(item => ({
          id: item.id,
          cartItemId: item.cartItemId,
          name: item.name,
          price: item.unitPrice,
          quantity: item.quantity,
          customization: item.customization || {},
          notes: item.notes || '',
          itemTotal: item.itemTotal
        })),
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        specialInstructions: specialInstructions.trim(),
        estimatedPrepTime: orderType === 'delivery' ? '25-35 min' : '10-15 min'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Save created order ID, clear cart, and navigate to confirmation
      const createdOrder = data.order;
      clearCart();
      addToast('Order received! The kitchen has begun preparation.', 'success');
      router.push(`/order-confirmation/${createdOrder.id}`);
    } catch (error) {
      console.error('Order submission failed:', error);
      addToast(error.message || 'Failed to process order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cafe-600 hover:text-cafe-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <div className="border-b border-cafe-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-caramel">
          Finalize Order
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-cafe-950 tracking-tight">
          Checkout & Confirmation
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Dining Type */}
          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4">
            <h2 className="text-base font-bold text-cafe-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cafe-900 text-cream-100 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Select Dining Preference</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dine-in', label: 'Dine-In', sub: 'Enjoy at a table' },
                { id: 'takeaway', label: 'Takeaway', sub: 'Counter pickup' },
                { id: 'delivery', label: 'Delivery', sub: 'To your door' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setOrderType(t.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    orderType === t.id
                      ? 'bg-cafe-900 text-cream-100 border-cafe-900 shadow-warm-sm'
                      : 'bg-cafe-50 text-cafe-800 border-cafe-200 hover:border-cafe-400'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className={`text-[11px] mt-0.5 ${orderType === t.id ? 'text-cafe-300' : 'text-cafe-500'}`}>
                    {t.sub}
                  </p>
                </button>
              ))}
            </div>

            {/* If Dine-In: Table Selector */}
            {orderType === 'dine-in' && (
              <div className="pt-3 border-t border-cafe-100 space-y-2">
                <label className="text-xs font-bold text-cafe-800">
                  Select Your Table
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[...Array(12)].map((_, i) => {
                    const tName = `Table ${i + 1}`;
                    const isSelected = tableNumber === tName;
                    return (
                      <button
                        type="button"
                        key={tName}
                        onClick={() => setTableNumber(tName)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-caramel text-white border-caramel shadow-sm'
                            : 'bg-white text-cafe-800 border-cafe-200 hover:border-cafe-400'
                        }`}
                      >
                        {tName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If Delivery: Street Address */}
            {orderType === 'delivery' && (
              <div className="pt-3 border-t border-cafe-100 space-y-2">
                <label className="text-xs font-bold text-cafe-800">
                  Delivery Street Address & Apt/Suite *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Apt 3B, CA 94103"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cafe-50 border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>
            )}
          </div>

          {/* Step 2: Contact Information */}
          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4">
            <h2 className="text-base font-bold text-cafe-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cafe-900 text-cream-100 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cafe-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cafe-50 border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cafe-700">Phone Number (For Status Updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cafe-50 border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-cafe-700">Email Address (For Digital Receipt)</label>
                <input
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cafe-50 border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-cafe-700">Special Kitchen Requests (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Extra napkins, please leave at door, allergy note..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cafe-50 border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4">
            <h2 className="text-base font-bold text-cafe-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cafe-900 text-cream-100 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'apple-pay', label: 'Apple Pay / Digital', icon: Sparkles },
                { id: 'counter-cash', label: 'Pay at Counter', icon: DollarSign },
              ].map((p) => {
                const IconComp = p.icon;
                const isSelected = paymentMethod === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-cafe-900 text-cream-100 border-cafe-900 shadow-sm'
                        : 'bg-cafe-50 text-cafe-800 border-cafe-200 hover:border-cafe-400'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-caramel-light' : 'text-cafe-600'}`} />
                    <span className="text-xs font-bold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Card Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-cafe-50 border border-cafe-200 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-cafe-600">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-cafe-200 font-mono text-cafe-900 focus:outline-none focus:border-cafe-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-cafe-600">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-cafe-200 font-mono text-cafe-900 focus:outline-none focus:border-cafe-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-cafe-600">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-cafe-200 font-mono text-cafe-900 focus:outline-none focus:border-cafe-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-[2rem] bg-white border border-cafe-200/80 shadow-warm-md space-y-5">
            <h2 className="text-base font-bold text-cafe-900 border-b border-cafe-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-cafe-500 font-normal">{itemCount} items</span>
            </h2>

            {/* Itemized preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-cafe-100 text-cafe-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {item.quantity}x
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-cafe-900 truncate">{item.name}</p>
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <p className="text-[10px] text-cafe-500 truncate">
                          {Object.values(item.customization).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-cafe-900 shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-cafe-600 border-t border-cafe-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-cafe-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sage-700 font-bold">
                  <span>Discount ({coupon?.code})</span>
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
              <div className="border-t border-cafe-200 pt-3 flex justify-between text-lg font-extrabold text-cafe-950">
                <span>Total Due</span>
                <span className="text-cafe-800">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-cafe-900 hover:bg-cafe-800 disabled:opacity-50 text-cream-100 font-bold text-sm transition-all shadow-warm-md flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting to Kitchen...</span>
                </>
              ) : (
                <>
                  <span>Place Order • ${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-caramel-light group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="p-3 bg-cafe-50 rounded-xl text-[11px] text-cafe-600 text-center leading-relaxed">
              ☕ Your order is sent directly to the baristas and kitchen in real-time.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

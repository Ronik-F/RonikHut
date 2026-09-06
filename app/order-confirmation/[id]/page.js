'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Coffee,
  ChefHat,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Printer,
  RotateCcw
} from 'lucide-react';

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', desc: 'Received by kitchen', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', desc: 'Accepted by barista', icon: CheckCircle2 },
  { id: 'preparing', label: 'Crafting', desc: 'Brewing & baking', icon: ChefHat },
  { id: 'ready', label: 'Ready', desc: 'Ready for table/pickup', icon: Sparkles },
  { id: 'completed', label: 'Enjoyed', desc: 'Order completed', icon: Coffee },
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C88A58', '#4D3322', '#FDFBF7', '#B85042', '#4A6B53']
      });
    } catch (e) {}
  }, []);

  // Fetch and poll order status every 4 seconds for live sync with Owner Portal!
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 4000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-cafe-200 border-t-cafe-800 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-cafe-900">Locating your order...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-cafe-900">Order Not Found</h2>
        <p className="text-xs text-cafe-600">We couldn't retrieve order #{orderId}.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cafe-900 text-cream-100 text-xs font-bold"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // Get current step index
  const currentStepIdx = Math.max(
    0,
    STATUS_STEPS.findIndex((s) => s.id === order.status)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-cafe-200/80 shadow-warm-md"
      >
        <div className="w-16 h-16 rounded-3xl bg-sage-50 text-sage-600 border border-sage-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-sage-500" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-caramel">
          Order #{order.orderNumber || order.id} Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-cafe-950 tracking-tight">
          "Your coffee is on its way to becoming a very good decision."
        </h1>

        <p className="text-xs sm:text-sm text-cafe-600 max-w-lg mx-auto">
          Thank you, <span className="font-bold text-cafe-900">{order.customer?.name}</span>. The kitchen has received your order and is crafting it fresh.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cafe-50 border border-cafe-200 text-xs font-semibold text-cafe-800">
          <Clock className="w-4 h-4 text-caramel" />
          <span>Estimated Prep Time: <strong className="text-cafe-900">{order.estimatedPrepTime || '12-15 min'}</strong></span>
        </div>
      </motion.div>

      {/* Live Order Status Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200/80 shadow-warm-sm space-y-6">
        <div className="flex items-center justify-between border-b border-cafe-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-beacon" />
            <h2 className="text-sm font-bold text-cafe-900 uppercase tracking-wider">
              Live Kitchen Tracker
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-cafe-500">
            Auto-syncs in real-time
          </span>
        </div>

        {/* Progress Bar & Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const IconComp = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-between ${
                  isCurrent
                    ? 'bg-cafe-900 text-cream-100 border-cafe-900 shadow-warm-sm scale-[1.02]'
                    : isCompleted
                    ? 'bg-sage-50 text-sage-800 border-sage-200'
                    : 'bg-cafe-50 text-cafe-400 border-cafe-200 opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                    isCurrent
                      ? 'bg-caramel text-cafe-950'
                      : isCompleted
                      ? 'bg-sage-500 text-white'
                      : 'bg-cafe-200 text-cafe-500'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">{step.label}</p>
                  <p className={`text-[10px] mt-0.5 ${isCurrent ? 'text-cafe-300' : 'text-cafe-500'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Customer Info & Instructions */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-cafe-200/80 shadow-warm-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cafe-600 border-b border-cafe-100 pb-2">
            Service Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Coffee className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cafe-900 capitalize">{order.customer?.type} Order</span>
                {order.customer?.tableNumber && (
                  <p className="text-caramel font-bold">{order.customer.tableNumber}</p>
                )}
                {order.customer?.deliveryAddress && (
                  <p className="text-cafe-600">{order.customer.deliveryAddress}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-caramel shrink-0" />
              <span className="text-cafe-700">{order.customer?.phone}</span>
            </div>

            {order.specialInstructions && (
              <div className="pt-2 border-t border-cafe-100">
                <span className="font-bold text-cafe-700">Special Notes:</span>
                <p className="text-cafe-600 italic mt-0.5">"{order.specialInstructions}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Receipt Breakdown */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-cafe-200/80 shadow-warm-sm space-y-4">
          <div className="flex items-center justify-between border-b border-cafe-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cafe-600">
              Receipt Breakdown
            </h3>
            <span className="text-[11px] font-mono text-cafe-500 uppercase">
              Paid via {order.paymentMethod}
            </span>
          </div>

          <div className="space-y-2.5">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <span className="font-bold text-cafe-900">{item.quantity}x {item.name}</span>
                  {item.customization && Object.keys(item.customization).length > 0 && (
                    <p className="text-[11px] text-cafe-500 truncate">
                      {Object.values(item.customization).join(', ')}
                    </p>
                  )}
                </div>
                <span className="font-bold text-cafe-800">
                  ${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-cafe-100 pt-3 space-y-1.5 text-xs text-cafe-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-cafe-900 font-semibold">${order.subtotal?.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sage-700 font-bold">
                <span>Discount</span>
                <span>-${order.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8.25%)</span>
              <span>${order.tax?.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee?.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-cafe-200 pt-2 flex justify-between text-base font-extrabold text-cafe-950">
              <span>Total Paid</span>
              <span className="text-cafe-900">${order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/menu"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cafe-900 hover:bg-cafe-800 text-cream-100 font-bold text-xs transition-all shadow-warm-sm text-center flex items-center justify-center gap-2"
        >
          <span>Order More Creations</span>
          <ArrowRight className="w-3.5 h-3.5 text-caramel-light" />
        </Link>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white border border-cafe-200 text-cafe-800 font-bold text-xs hover:bg-cafe-50 transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-3.5 h-3.5 text-cafe-600" />
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  );
}

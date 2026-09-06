'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Coffee,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import { useToast } from '@/lib/toastContext';

export default function CustomerOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const handleLookupOrder = async (e) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;

    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(searchOrderId.trim())}`);
      const data = await res.json();
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        addToast(`Found order #${searchOrderId}`, 'success');
      } else {
        addToast(`No order found matching "${searchOrderId}"`, 'error');
      }
    } catch (e) {
      addToast('Search failed', 'error');
    }
  };

  const handleReorder = (order) => {
    order.items?.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price || item.unitPrice,
          image: item.image || 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
          category: 'coffee'
        },
        item.quantity || 1,
        item.customization || {}
      );
    });
    addToast('Items re-added to your cart!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cafe-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Activity & History
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cafe-950 tracking-tight">
            Order Tracking & History
          </h1>
        </div>

        {/* Quick Lookup Bar */}
        <form onSubmit={handleLookupOrder} className="flex gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cafe-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track Order (e.g. 8921)"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-cafe-200 rounded-xl focus:outline-none focus:border-cafe-600 text-cafe-900"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-cafe-900 hover:bg-cafe-800 text-cream-100 font-bold text-xs rounded-xl transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-cafe-200 border-t-cafe-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-cafe-600">Loading order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cafe-200/80 shadow-warm-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cafe-100 flex items-center justify-center mx-auto text-cafe-400">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-cafe-900">No orders found</h3>
          <p className="text-xs text-cafe-600">
            You have not placed any orders yet. Ready to experience our specialty brew?
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cafe-900 text-cream-100 text-xs font-bold shadow-warm-sm hover:bg-cafe-800 transition-colors"
          >
            <span>Explore Menu</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-cafe-950">
                      Order #{order.orderNumber || order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-sage-50 text-sage-700 border border-sage-200'
                          : order.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-cafe-500 font-medium">{dateStr} • {order.customer?.type || 'dine-in'}</p>

                  <div className="text-xs text-cafe-700 space-y-0.5">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="inline-block mr-2 font-medium">
                        {item.quantity}x {item.name}
                        {idx < order.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-cafe-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-cafe-500 font-medium">Total</span>
                    <p className="text-base font-extrabold text-cafe-900">${order.total?.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reorder</span>
                    </button>

                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-cafe-900 hover:bg-cafe-800 text-cream-100 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>Track</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

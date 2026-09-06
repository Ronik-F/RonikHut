'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

export default function OwnerDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 6000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Order #${orderId} updated to ${newStatus}`, 'success');
        fetchAnalytics();
      } else {
        addToast(data.error || 'Failed to update order', 'error');
      }
    } catch (e) {
      addToast('Status update failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-cafe-400">
        <div className="w-10 h-10 border-4 border-cafe-700 border-t-caramel rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Gathering cafe analytics...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    todayRevenue = 0,
    totalOrders = 0,
    todayOrdersCount = 0,
    activeOrdersCount = 0,
    totalMenuItems = 82,
    popularItems = [],
    recentOrders = []
  } = analytics || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Live Business Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cream-100 tracking-tight">
            Cafe Operations Overview
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/owner/orders"
            className="px-4 py-2 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-xs font-bold text-cream-100 border border-cafe-700 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-caramel" />
            <span>Manage All Orders</span>
          </Link>
          <Link
            href="/owner/menu"
            className="px-4 py-2 rounded-xl bg-caramel hover:bg-caramel-light text-xs font-bold text-cafe-950 transition-colors flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu Manager</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cream-100">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-cafe-400 font-medium">All-time lifetime revenue</p>
        </div>

        <div className="p-5 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-400 uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-caramel/20 text-caramel-light flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-caramel-light">${todayRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-cafe-400 font-medium">{todayOrdersCount} orders placed today</p>
        </div>

        <div className="p-5 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-400 uppercase tracking-wider">Active Kitchen Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cream-100">{activeOrdersCount}</p>
          <p className="text-[11px] text-amber-400 font-medium">In pending / preparing / ready</p>
        </div>

        <div className="p-5 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-400 uppercase tracking-wider">Menu Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-cafe-800 text-caramel flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cream-100">{totalMenuItems}</p>
          <p className="text-[11px] text-cafe-400 font-medium">Active food & drink creations</p>
        </div>
      </div>

      {/* Main Grid: Kitchen Live Queue & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Kitchen Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between border-b border-cafe-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-beacon" />
                <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider">
                  Live Orders Stream
                </h2>
              </div>
              <Link href="/owner/orders" className="text-xs font-bold text-caramel hover:underline flex items-center gap-1">
                <span>View Full Orders Hub</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-cafe-400 text-xs">
                No orders yet. New customer orders will appear here automatically.
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-cafe-950/80 border border-cafe-800 hover:border-cafe-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-extrabold text-cream-100">
                          #{order.orderNumber || order.id}
                        </span>
                        <span className="text-xs font-bold text-caramel">
                          {order.customer?.name}
                        </span>
                        <span className="text-[11px] text-cafe-400 capitalize">
                          ({order.customer?.type} {order.customer?.tableNumber ? `• ${order.customer.tableNumber}` : ''})
                        </span>
                      </div>

                      <div className="text-xs text-cafe-300">
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-cafe-500">
                        <span>Total: <strong className="text-cream-100">${order.total?.toFixed(2)}</strong></span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Status & Quick Status Advance Action */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'ready'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : order.status === 'preparing'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : order.status === 'confirmed'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-cafe-800 text-cream-300 border border-cafe-700'
                        }`}
                      >
                        {order.status}
                      </span>

                      {/* Quick Next-Action Buttons */}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Start Prep
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'ready')}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Top Selling Items */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4">
            <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider border-b border-cafe-800 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-caramel" />
              <span>Top Seller Highlights</span>
            </h2>

            {popularItems.length === 0 ? (
              <p className="text-xs text-cafe-400 text-center py-6">
                Orders will rank bestsellers automatically.
              </p>
            ) : (
              <div className="space-y-3">
                {popularItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-cafe-950/60 border border-cafe-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-cafe-800 text-caramel font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-cream-100 truncate">{item.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-caramel-light">{item.totalSold} sold</p>
                      <p className="text-[10px] text-cafe-400">${item.totalRevenue?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-cafe-800">
              <Link
                href="/owner/menu"
                className="w-full py-2.5 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-cream-100 text-xs font-bold text-center block transition-colors"
              >
                Manage 80+ Menu Items
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Coffee,
  X,
  Search,
  ChevronRight,
  Filter,
  Utensils
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready for Pickup' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Order #${orderId} updated to ${newStatus.toUpperCase()}`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        addToast(data.error || 'Failed to update order', 'error');
      }
    } catch (e) {
      addToast('Status update failed', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const matchSearch =
      !searchQuery.trim() ||
      o.orderNumber?.includes(searchQuery) ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.phone?.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Kitchen & Counter Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cream-100 tracking-tight">
            Live Order Management ({orders.length} Total)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-beacon" />
          <span className="text-xs font-bold text-cafe-300">Live order listener active</span>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-4 rounded-3xl bg-cafe-900 border border-cafe-800 space-y-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer name, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-cafe-950 border border-cafe-700 rounded-xl text-cream-100 focus:outline-none focus:border-caramel"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-cafe-800 pt-3">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === 'all'
                ? orders.length
                : orders.filter((o) => o.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-caramel text-cafe-950 shadow-sm'
                    : 'bg-cafe-800 text-cafe-300 hover:bg-cafe-700'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id
                      ? 'bg-cafe-950 text-caramel'
                      : 'bg-cafe-900 text-cafe-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-20 text-cafe-400 text-xs font-semibold">
          Loading live orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-cafe-900 rounded-3xl border border-cafe-800 text-cafe-400 text-xs">
          No orders found in "{activeTab}" status.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const timeAgo = new Date(order.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-5 rounded-3xl bg-cafe-900 border border-cafe-800 hover:border-cafe-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer shadow-warm-sm"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-cream-100">
                      Order #{order.orderNumber || order.id}
                    </span>
                    <span className="text-xs font-bold text-caramel">
                      {order.customer?.name}
                    </span>
                    <span className="text-[11px] text-cafe-400 capitalize">
                      • {order.customer?.type} {order.customer?.tableNumber ? `(${order.customer.tableNumber})` : ''}
                    </span>
                    <span className="text-[11px] text-cafe-500">• {timeAgo}</span>
                  </div>

                  <div className="text-xs text-cafe-300 font-medium">
                    {order.items?.map((item) => `${item.quantity}x ${item.name}`).join(' | ')}
                  </div>

                  {order.specialInstructions && (
                    <p className="text-[11px] text-amber-300 italic">
                      Special Note: "{order.specialInstructions}"
                    </p>
                  )}
                </div>

                {/* Right Actions & Status Badges */}
                <div
                  className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-cafe-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-left md:text-right mr-2">
                    <span className="text-[10px] text-cafe-500 uppercase font-bold">Total</span>
                    <p className="text-base font-extrabold text-cream-100">${order.total?.toFixed(2)}</p>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      order.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : order.status === 'ready'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : order.status === 'preparing'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : order.status === 'confirmed'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-cafe-800 text-cream-200 border border-cafe-700'
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Status Advance Action Button */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Start Brewing / Baking
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-cafe-900 border border-cafe-800 rounded-3xl p-6 sm:p-8 shadow-warm-xl z-10 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-cafe-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-caramel">
                    Order Details
                  </span>
                  <h2 className="text-xl font-extrabold text-cream-100">
                    Order #{selectedOrder.orderNumber || selectedOrder.id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-cafe-400 hover:text-white p-1"
                  aria-label="Close order details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer summary */}
              <div className="p-4 rounded-2xl bg-cafe-950 border border-cafe-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-cafe-400">Customer:</span>
                  <span className="font-bold text-cream-100">{selectedOrder.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-400">Phone:</span>
                  <span className="font-bold text-caramel-light">{selectedOrder.customer?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cafe-400">Order Type:</span>
                  <span className="font-bold text-cream-100 capitalize">{selectedOrder.customer?.type}</span>
                </div>
                {selectedOrder.customer?.tableNumber && (
                  <div className="flex justify-between">
                    <span className="text-cafe-400">Table:</span>
                    <span className="font-bold text-caramel-light">{selectedOrder.customer?.tableNumber}</span>
                  </div>
                )}
                {selectedOrder.customer?.deliveryAddress && (
                  <div className="flex justify-between">
                    <span className="text-cafe-400">Delivery Address:</span>
                    <span className="font-bold text-cream-100 text-right">{selectedOrder.customer?.deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cafe-400">
                  Kitchen Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-cafe-950/60 border border-cafe-800 text-xs flex justify-between items-start">
                      <div>
                        <p className="font-bold text-cream-100">{item.quantity}x {item.name}</p>
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <p className="text-[11px] text-cafe-400 mt-0.5">
                            {Object.values(item.customization).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-amber-300 italic mt-0.5">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-cream-100">
                        ${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Breakdown */}
              <div className="border-t border-cafe-800 pt-3 space-y-1.5 text-xs text-cafe-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${selectedOrder.tax?.toFixed(2)}</span>
                </div>
                {selectedOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${selectedOrder.deliveryFee?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-cream-100 pt-1 border-t border-cafe-800">
                  <span>Total Due</span>
                  <span className="text-caramel-light">${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Advance Selector inside Modal */}
              <div className="space-y-2 pt-2 border-t border-cafe-800">
                <label className="text-xs font-bold text-cafe-400">Update Order Status:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedOrder.status === st
                          ? 'bg-caramel text-cafe-950 shadow-sm'
                          : 'bg-cafe-800 text-cream-300 hover:bg-cafe-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

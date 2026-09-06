'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  UtensilsCrossed,
  Image as ImageIcon,
  DollarSign,
  Flame,
  Leaf,
  Filter
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { INITIAL_CATEGORIES } from '@/lib/initialData';

export default function OwnerMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // null when adding new
  const [isDeletingId, setIsDeletingId] = useState(null);
  const { addToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '',
    ingredients: '',
    prepTime: '5 min',
    calories: '150',
    inStock: true,
    isPopular: false,
    isBestseller: false,
    isNew: false,
    isVegetarian: false,
    isSpicy: false,
    isGlutenFree: false
  });

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.items) {
        setMenuItems(data.items);
      }
    } catch (e) {
      console.error('Failed to load menu', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'coffee',
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
      ingredients: 'Arabica coffee, milk',
      prepTime: '3-5 min',
      calories: '120',
      inStock: true,
      isPopular: false,
      isBestseller: false,
      isNew: true,
      isVegetarian: true,
      isSpicy: false,
      isGlutenFree: true
    });
    setEditModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : '',
      prepTime: item.prepTime || '5 min',
      calories: (item.calories || 150).toString(),
      inStock: item.inStock !== false,
      isPopular: !!item.isPopular,
      isBestseller: !!item.isBestseller,
      isNew: !!item.isNew,
      isVegetarian: !!item.isVegetarian,
      isSpicy: !!item.isSpicy,
      isGlutenFree: !!item.isGlutenFree
    });
    setEditModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      addToast('Name, price, and category are required', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        calories: parseInt(formData.calories) || 0,
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        categoryLabel: INITIAL_CATEGORIES.find(c => c.id === formData.category)?.label || formData.category
      };

      if (currentItem) {
        // Update existing
        const res = await fetch(`/api/menu/${currentItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          addToast(`Updated "${formData.name}"`, 'success');
          setEditModalOpen(false);
          fetchMenu();
        } else {
          addToast(data.error || 'Failed to update', 'error');
        }
      } else {
        // Create new item
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          addToast(`Added new item "${formData.name}" to menu!`, 'success');
          setEditModalOpen(false);
          fetchMenu();
        } else {
          addToast(data.error || 'Failed to create item', 'error');
        }
      }
    } catch (error) {
      addToast('Operation failed', 'error');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast(`Deleted "${name}"`, 'info');
        fetchMenu();
      } else {
        addToast(data.error || 'Delete failed', 'error');
      }
    } catch (e) {
      addToast('Delete failed', 'error');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleToggleStock = async (item) => {
    const updatedStock = !item.inStock;
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updatedStock })
      });
      if (res.ok) {
        addToast(`${item.name} marked as ${updatedStock ? 'In-Stock' : 'Out of Stock'}`, 'success');
        setMenuItems(prev =>
          prev.map(i => (i.id === item.id ? { ...i, inStock: updatedStock } : i))
        );
      }
    } catch (e) {
      addToast('Failed to update stock', 'error');
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-caramel">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-cream-100 tracking-tight">
            Menu Items ({menuItems.length} Total)
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-caramel hover:bg-caramel-light text-cafe-950 font-extrabold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cafe-900 border border-cafe-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by item name or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-cafe-950 border border-cafe-700 rounded-xl text-cream-100 focus:outline-none focus:border-caramel"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 text-xs font-bold bg-cafe-950 border border-cafe-700 rounded-xl text-cream-100 focus:outline-none focus:border-caramel cursor-pointer"
            >
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-cafe-800 pt-3">
          {INITIAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-caramel text-cafe-950 font-bold'
                  : 'bg-cafe-800 text-cafe-300 hover:bg-cafe-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      {loading ? (
        <div className="text-center py-20 text-cafe-400 text-xs font-semibold">
          Loading menu items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-cafe-900 rounded-3xl border border-cafe-800 text-cafe-400 text-xs">
          No items match your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-cafe-900 border border-cafe-800 hover:border-cafe-700 transition-all flex flex-col justify-between gap-3 shadow-warm-sm"
            >
              <div className="flex gap-3.5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cafe-800 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {item.inStock === false && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-[9px] font-bold text-terracotta-light">
                      Sold Out
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-caramel">
                      {item.categoryLabel || item.category}
                    </span>
                    <span className="text-sm font-extrabold text-cream-100">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-cream-100 truncate">{item.name}</h3>
                  <p className="text-[11px] text-cafe-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Controls: Stock Toggle & Actions */}
              <div className="pt-3 border-t border-cafe-800/80 flex items-center justify-between">
                {/* In Stock toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleStock(item)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                    item.inStock !== false
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.inStock !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span>{item.inStock !== false ? 'In Stock' : 'Sold Out'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-cream-200 transition-colors"
                    title="Edit Item"
                    aria-label="Edit item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    disabled={isDeletingId === item.id}
                    className="p-2 rounded-xl bg-cafe-800 hover:bg-terracotta-dark text-terracotta-light transition-colors"
                    title="Delete Item"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Menu Item Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-cafe-900 border border-cafe-800 rounded-3xl p-6 sm:p-8 shadow-warm-xl z-10 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-cafe-800 pb-3">
                <h2 className="text-lg font-bold text-cream-100">
                  {currentItem ? `Edit: ${currentItem.name}` : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-cafe-400 hover:text-white p-1"
                  aria-label="Close form modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-cafe-300">Item Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vanilla Bean Cold Foam Latte"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-cafe-300">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    >
                      {INITIAL_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-cafe-300">Price ($ USD) *</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      placeholder="e.g. 5.75"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-cafe-300">Prep Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 3-5 min"
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-cafe-300">Image URL (Unsplash Photo) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-cafe-300">Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Sensory description of flavors, textures, and origins..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-cafe-300">Ingredients (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Espresso, Whole Milk, Madagascar Vanilla, Cane Sugar"
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                    />
                  </div>
                </div>

                {/* Flags Checkboxes */}
                <div className="pt-2 border-t border-cafe-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-cafe-300">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded bg-cafe-950 border-cafe-700 text-caramel focus:ring-0"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-cafe-300">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded bg-cafe-950 border-cafe-700 text-caramel focus:ring-0"
                    />
                    <span>Mark Popular</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-cafe-300">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded bg-cafe-950 border-cafe-700 text-caramel focus:ring-0"
                    />
                    <span>Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-cafe-300">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      className="rounded bg-cafe-950 border-cafe-700 text-caramel focus:ring-0"
                    />
                    <span>Vegetarian</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-cafe-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-cream-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-caramel hover:bg-caramel-light text-cafe-950 font-extrabold shadow-sm"
                  >
                    {currentItem ? 'Save Changes' : 'Create Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

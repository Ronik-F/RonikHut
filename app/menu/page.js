'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  UtensilsCrossed,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import FoodDetailModal from '@/components/FoodDetailModal';
import CategoryFilter from '@/components/CategoryFilter';
import { INITIAL_MENU_ITEMS } from '@/lib/initialData';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all'); // 'all' | 'popular' | 'bestseller' | 'new' | 'vegetarian' | 'spicy' | 'glutenFree'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'popular'
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch live menu items from API
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts = { all: menuItems.length };
    menuItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [menuItems]);

  // Filter & Sort items
  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // Dietary / Tag filter
    if (selectedTag === 'popular') result = result.filter((i) => i.isPopular);
    if (selectedTag === 'bestseller') result = result.filter((i) => i.isBestseller);
    if (selectedTag === 'new') result = result.filter((i) => i.isNew);
    if (selectedTag === 'vegetarian') result = result.filter((i) => i.isVegetarian);
    if (selectedTag === 'spicy') result = result.filter((i) => i.isSpicy);
    if (selectedTag === 'glutenFree') result = result.filter((i) => i.isGlutenFree);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [menuItems, selectedCategory, searchQuery, selectedTag, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedTag('all');
    setSortBy('recommended');
  };

  const tagFilters = [
    { id: 'all', label: 'All Choices' },
    { id: 'bestseller', label: '⭐ Bestsellers' },
    { id: 'popular', label: '🔥 Popular' },
    { id: 'vegetarian', label: '🌱 Vegetarian' },
    { id: 'new', label: '✨ New' },
    { id: 'spicy', label: '🌶️ Spicy' },
    { id: 'glutenFree', label: '🌾 Gluten-Free' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Page Title & Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white border border-cafe-200/80 shadow-warm-sm text-caramel inline-block">
          Handcrafted Fresh Daily
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cafe-950 tracking-tight">
          The RonyCafeHut Menu
        </h1>
        <p className="text-xs sm:text-sm text-cafe-600 leading-relaxed">
          Explore over 80 specialty coffees, single-origin teas, slow-fermented woodfired pizzas, fresh bakery pastries, and decadent desserts.
        </p>
      </div>

      {/* Sticky Filter & Search Control Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-cafe-200/80 shadow-warm-md space-y-4">
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-cafe-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coffee, pizza, croissant, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs bg-cafe-50 border border-cafe-200/90 rounded-2xl focus:outline-none focus:border-cafe-600 text-cafe-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-52">
              <ArrowUpDown className="w-3.5 h-3.5 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-3 text-xs font-semibold bg-cafe-50 border border-cafe-200/90 rounded-2xl text-cafe-800 focus:outline-none focus:border-cafe-600 transition-colors cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="border-t border-cafe-100 pt-3">
          <CategoryFilter
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Dietary / Tag Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-cafe-100 pt-3">
          <span className="text-[11px] font-bold text-cafe-500 uppercase tracking-wider mr-1 shrink-0">
            Dietary:
          </span>
          {tagFilters.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setSelectedTag(tf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tf.id
                  ? 'bg-cafe-800 text-cream-100 shadow-sm'
                  : 'bg-cafe-100 text-cafe-700 hover:bg-cafe-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header: Count & Active Filters */}
      <div className="flex items-center justify-between text-xs font-medium text-cafe-600 px-1">
        <p>
          Showing <span className="font-bold text-cafe-900">{filteredItems.length}</span> items
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {(selectedCategory !== 'all' || searchQuery || selectedTag !== 'all' || sortBy !== 'recommended') && (
          <button
            onClick={clearAllFilters}
            className="text-terracotta hover:underline font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cafe-200/80 shadow-warm-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cafe-100 flex items-center justify-center mx-auto text-cafe-400">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-cafe-900">No items match your search</h3>
          <p className="text-xs text-cafe-600">
            We couldn't find any menu creations matching your current query or filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2.5 rounded-full bg-cafe-900 text-cream-100 text-xs font-bold hover:bg-cafe-800 transition-colors shadow-warm-sm"
          >
            View All 80+ Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={(i) => setSelectedItem(i)}
            />
          ))}
        </div>
      )}

      {/* Food Detail Modal with Customizer */}
      {selectedItem && (
        <FoodDetailModal
          item={selectedItem}
          allItems={menuItems}
          onClose={() => setSelectedItem(null)}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-cafe-200 border-t-cafe-800 animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-cafe-700">Brewing the menu...</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}

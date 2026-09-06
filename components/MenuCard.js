'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Plus, Flame, Leaf, Sparkles, Clock, Check } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function MenuCard({ item, onOpenDetail }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenDetail(item)}
      className="group bg-white rounded-3xl overflow-hidden border border-cafe-200/70 shadow-warm-sm hover:shadow-warm-md transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full pt-[68%] overflow-hidden bg-cafe-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex flex-wrap gap-1">
            {item.isBestseller && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-white shadow-sm backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Bestseller
              </span>
            )}
            {item.isPopular && !item.isBestseller && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-caramel text-white shadow-sm backdrop-blur-xs">
                Popular
              </span>
            )}
            {item.isNew && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage-500 text-white shadow-sm">
                New
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.isVegetarian && (
              <span className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm text-green-700 flex items-center justify-center shadow-sm" title="Vegetarian">
                <Leaf className="w-3.5 h-3.5" />
              </span>
            )}
            {item.isSpicy && (
              <span className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm text-terracotta flex items-center justify-center shadow-sm" title="Spicy">
                <Flame className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Rating chip on bottom left of image */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-cafe-900 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{item.rating?.toFixed(1) || '4.9'}</span>
          <span className="text-[10px] text-cafe-500 font-normal">({item.reviewCount || 48})</span>
        </div>

        {item.prepTime && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-cafe-950/70 backdrop-blur-sm text-[10px] font-medium text-cream-100 flex items-center gap-1">
            <Clock className="w-3 h-3 text-caramel-light" />
            <span>{item.prepTime}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-caramel">
              {item.categoryLabel || item.category}
            </span>
            {item.inStock === false && (
              <span className="text-[10px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-cafe-900 group-hover:text-cafe-700 transition-colors line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-cafe-600 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-2 border-t border-cafe-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-cafe-500 font-medium">Price</span>
            <p className="text-lg font-bold text-cafe-900">${item.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={item.inStock === false}
              className={`p-2.5 rounded-2xl flex items-center justify-center transition-all ${
                justAdded
                  ? 'bg-sage-500 text-white scale-110'
                  : 'bg-cafe-900 text-cream-100 hover:bg-cafe-800 hover:scale-105 shadow-warm-sm'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label={`Add ${item.name} to cart`}
            >
              {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

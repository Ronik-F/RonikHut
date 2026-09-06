'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Coffee,
  Leaf,
  Pizza,
  Sun,
  Croissant,
  Cake,
  Sandwich,
  CupSoda
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/initialData';

const ICONS_MAP = {
  Sparkles: Sparkles,
  Coffee: Coffee,
  Leaf: Leaf,
  Pizza: Pizza,
  Sun: Sun,
  Croissant: Croissant,
  Cake: Cake,
  Sandwich: Sandwich,
  CupSoda: CupSoda,
};

export default function CategoryFilter({ activeCategory, onSelectCategory, categoryCounts = {} }) {
  return (
    <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max px-1">
        {INITIAL_CATEGORIES.map((cat) => {
          const IconComponent = ICONS_MAP[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? cat.count;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-cafe-900 text-cream-100 border-cafe-900 shadow-warm-sm'
                  : 'bg-white text-cafe-800 border-cafe-200/80 hover:border-cafe-400 hover:bg-cafe-50'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${
                  isActive ? 'text-caramel-light' : 'text-cafe-600'
                }`}
              />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-cafe-800 text-cream-200'
                      : 'bg-cafe-100 text-cafe-700'
                  }`}
                >
                  {count}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 border-2 border-caramel/40 rounded-2xl pointer-events-none"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

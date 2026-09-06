'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Plus,
  Minus,
  Clock,
  Flame,
  Leaf,
  ShoppingBag,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function FoodDetailModal({ item, allItems = [], onClose, onSelectItem }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Initialize default options when modal opens or item changes
  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSpecialNotes('');

    const initial = {};
    if (item.customizationOptions) {
      Object.entries(item.customizationOptions).forEach(([groupKey, options]) => {
        if (Array.isArray(options) && options.length > 0) {
          // If option objects have name/price or are strings
          const first = options[0];
          initial[groupKey] = typeof first === 'object' ? first.name : first;
        }
      });
    }
    setSelectedCustomizations(initial);
  }, [item]);

  if (!item) return null;

  // Calculate live unit price based on customization
  const calculateExtra = () => {
    let extra = 0;
    if (item.customizationOptions) {
      Object.entries(selectedCustomizations).forEach(([groupKey, selectedVal]) => {
        const optionsList = item.customizationOptions[groupKey];
        if (Array.isArray(optionsList)) {
          const matchObj = optionsList.find(o => (typeof o === 'object' ? o.name === selectedVal : o === selectedVal));
          if (matchObj && typeof matchObj === 'object' && matchObj.price) {
            extra += matchObj.price;
          } else if (typeof selectedVal === 'string') {
            const match = selectedVal.match(/\+\$?([0-9.]+)/);
            if (match && match[1]) {
              extra += parseFloat(match[1]);
            }
          }
        }
      });
    }
    return extra;
  };

  const unitPrice = item.price + calculateExtra();
  const totalPrice = unitPrice * quantity;

  const handleOptionSelect = (groupKey, value) => {
    setSelectedCustomizations(prev => ({
      ...prev,
      [groupKey]: value
    }));
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedCustomizations, specialNotes);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
  };

  // Find related items from the same category
  const relatedItems = allItems
    .filter(i => i.id !== item.id && i.category === item.category)
    .slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-cafe-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="relative w-full max-w-2xl bg-cream-50 rounded-3xl shadow-warm-xl border border-cafe-200 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-cafe-800 hover:bg-white flex items-center justify-center shadow-warm-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1">
            {/* Main Image */}
            <div className="relative w-full h-64 sm:h-72 bg-cafe-900">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/80 via-transparent to-transparent" />

              {/* Header tags in image */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-caramel text-white shadow-sm inline-block mb-1.5">
                    {item.categoryLabel || item.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-cream-100 tracking-tight leading-tight">
                    {item.name}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-cream-300 font-medium">Base Price</span>
                  <p className="text-2xl font-bold text-caramel-light">${item.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badges strip: Rating, Calories, Prep time, Dietary */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{item.rating?.toFixed(1) || '4.9'} ({item.reviewCount || 48} reviews)</span>
                </div>

                {item.prepTime && (
                  <div className="px-3 py-1.5 rounded-xl bg-cafe-100 text-cafe-800 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cafe-600" />
                    <span>{item.prepTime}</span>
                  </div>
                )}

                {item.calories && (
                  <div className="px-3 py-1.5 rounded-xl bg-cafe-100 text-cafe-800 font-semibold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-terracotta" />
                    <span>{item.calories} kcal</span>
                  </div>
                )}

                {item.isVegetarian && (
                  <div className="px-3 py-1.5 rounded-xl bg-sage-50 text-sage-700 border border-sage-200/60 font-semibold flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-sage-500" />
                    <span>Vegetarian</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cafe-500 mb-1.5">Description</h4>
                <p className="text-sm text-cafe-800 leading-relaxed">{item.description}</p>
              </div>

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cafe-500 mb-2">Ingredients & Craft</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white border border-cafe-200/80 text-xs font-medium text-cafe-700 shadow-warm-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization Options */}
              {item.customizationOptions && Object.keys(item.customizationOptions).length > 0 && (
                <div className="space-y-4 pt-2 border-t border-cafe-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cafe-500">
                    Customize Your Order
                  </h4>

                  {Object.entries(item.customizationOptions).map(([groupKey, options]) => {
                    const groupLabel = groupKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                      <div key={groupKey} className="space-y-2">
                        <label className="text-xs font-bold text-cafe-800 flex items-center justify-between">
                          <span>{groupLabel}</span>
                          <span className="text-[11px] text-cafe-500 font-normal">Choose one</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {options.map((opt, idx) => {
                            const optName = typeof opt === 'object' ? opt.name : opt;
                            const optPrice = typeof opt === 'object' && opt.price ? ` (+$${opt.price.toFixed(2)})` : '';
                            const isSelected = selectedCustomizations[groupKey] === optName;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleOptionSelect(groupKey, optName)}
                                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-cafe-900 text-cream-100 border-cafe-900 shadow-sm'
                                    : 'bg-white text-cafe-800 border-cafe-200 hover:border-cafe-400'
                                }`}
                              >
                                <span className="truncate">{optName}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-caramel-light shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Special Instructions Note */}
              <div className="space-y-1.5 pt-2 border-t border-cafe-200">
                <label className="text-xs font-bold uppercase tracking-wider text-cafe-500">
                  Special Kitchen Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra hot, lightly sweetened, no ice..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-cafe-200 text-xs text-cafe-900 focus:outline-none focus:border-cafe-600"
                />
              </div>

              {/* Related Items Spotlight */}
              {relatedItems.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-cafe-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cafe-500">
                    Pairs Perfectly With
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {relatedItems.map(rel => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectItem && onSelectItem(rel)}
                        className="p-2 rounded-2xl bg-white border border-cafe-200/80 hover:border-cafe-400 text-left transition-all group"
                      >
                        <div className="relative w-full pt-[65%] rounded-xl overflow-hidden mb-1.5 bg-cafe-100">
                          <Image src={rel.image} alt={rel.name} fill sizes="150px" className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <p className="text-xs font-bold text-cafe-900 truncate">{rel.name}</p>
                        <p className="text-[11px] font-bold text-caramel">${rel.price.toFixed(2)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Sticky Bottom Bar */}
          <div className="p-4 sm:p-6 bg-white border-t border-cafe-200 shadow-warm-lg flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-cafe-50 border border-cafe-200 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-cafe-800 hover:bg-cafe-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-cafe-900 w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-cafe-800 hover:bg-cafe-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-warm-md flex items-center justify-center gap-2 ${
                addedAnimation
                  ? 'bg-sage-500 text-white'
                  : 'bg-cafe-900 hover:bg-cafe-800 text-cream-100'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-caramel-light" />
                  <span>Add to Order</span>
                  <span className="opacity-60">•</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

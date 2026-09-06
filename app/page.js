'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Coffee,
  Sparkles,
  ArrowRight,
  Star,
  Clock,
  Award,
  Flame,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ChevronRight
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import FoodDetailModal from '@/components/FoodDetailModal';
import { useCart } from '@/lib/cartContext';
import { INITIAL_MENU_ITEMS } from '@/lib/initialData';

export default function HomePage() {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('coffee');
  const { setIsCartOpen } = useCart();

  // Load latest menu items from backend API
  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
        }
      } catch (e) {
        // Fallback to INITIAL_MENU_ITEMS
      }
    }
    loadMenu();
  }, []);

  // Filter sections
  const featuredItems = menuItems.filter(i => i.isBestseller || i.isPopular).slice(0, 4);
  const tabItems = menuItems.filter(i => i.category === activeTab).slice(0, 4);
  const coffeeHighlights = menuItems.filter(i => i.category === 'coffee').slice(0, 3);
  const pizzaHighlights = menuItems.filter(i => i.category === 'pizza').slice(0, 3);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative pt-6 pb-12 sm:pb-20 lg:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Cozy Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-cafe-200/80 shadow-warm-sm text-xs font-bold text-cafe-800">
                <span className="w-2 h-2 rounded-full bg-caramel animate-pulse" />
                <span>Specialty Roastery & Kitchen Open Daily</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-cafe-950 tracking-tight leading-[1.15]">
                Your cozy corner for{' '}
                <span className="relative inline-block text-cafe-800 underline decoration-caramel/40 decoration-wavy decoration-2">
                  good coffee
                </span>
                , good food & good moments.
              </h1>

              <p className="text-base sm:text-lg text-cafe-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Step inside RonyCafeHut. Warm lighting, the soothing aroma of single-origin espresso, blistered sourdough pizza, and flaky morning pastries crafted with patient devotion.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-cafe-900 text-cream-100 font-bold text-sm hover:bg-cafe-800 transition-all shadow-warm-md flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <span>Explore Menu (80+ Items)</span>
                  <ArrowRight className="w-4 h-4 text-caramel-light group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white border border-cafe-200/80 text-cafe-900 font-bold text-sm hover:bg-cafe-50 transition-all shadow-warm-sm flex items-center justify-center gap-2"
                >
                  <Coffee className="w-4 h-4 text-caramel" />
                  <span>Start an Order</span>
                </button>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-6 border-t border-cafe-200/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-cafe-900">4.9 ★</p>
                  <p className="text-xs text-cafe-600 font-medium">1,200+ Reviews</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-cafe-900">80+</p>
                  <p className="text-xs text-cafe-600 font-medium">Artisan Items</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-cafe-900">48-Hr</p>
                  <p className="text-xs text-cafe-600 font-medium">Slow Sourdough</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Imagery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-warm-xl border-4 border-white bg-cafe-200">
                  <Image
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
                    alt="RonyCafeHut Warm Atmosphere"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cafe-950/60 via-transparent to-transparent" />

                  {/* Caption inside image */}
                  <div className="absolute bottom-6 left-6 right-6 text-cream-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-caramel-light">Velvet Quarter Cafe</p>
                    <p className="text-lg font-bold">"A warm refuge for coffee aficionados & food lovers."</p>
                  </div>
                </div>

                {/* Floating Badge 1: Top Rated Coffee */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-lg border border-cafe-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-cafe-100 flex items-center justify-center text-caramel">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cafe-900">Single Origin Roast</p>
                    <p className="text-[11px] text-cafe-600">Ethiopian & Colombian</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Fresh Morning Pastries */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-lg border border-cafe-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cafe-900">Baked at 5:00 AM</p>
                    <p className="text-[11px] text-cafe-600">Normandy AOP Butter</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED CHEF SPECIALS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-caramel mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handcrafted Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cafe-950">
              Featured Chef Specials
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-cafe-800 hover:text-caramel flex items-center gap-1 group"
          >
            <span>View all 80+ items</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenDetail={(i) => setSelectedItem(i)}
            />
          ))}
        </div>
      </section>

      {/* ==========================================
          POPULAR TODAY (INTERACTIVE CATEGORY TABS)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 rounded-[2.5rem] p-6 sm:p-10 border border-cafe-200/80 shadow-warm-md">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-caramel">
              Fresh From Our Kitchen & Bar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cafe-950">
              Popular Today
            </h2>
            <p className="text-xs sm:text-sm text-cafe-600">
              Discover what our regulars are savoring this week.
            </p>

            {/* Category Switcher Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: 'coffee', label: 'Coffee' },
                { id: 'pizza', label: 'Artisanal Pizza' },
                { id: 'breakfast', label: 'Breakfast' },
                { id: 'pastries', label: 'Pastries' },
                { id: 'desserts', label: 'Desserts' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-cafe-900 text-cream-100 shadow-sm'
                      : 'bg-cafe-100 text-cafe-700 hover:bg-cafe-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tabItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onOpenDetail={(i) => setSelectedItem(i)}
              />
            ))}
          </div>

          <div className="text-center pt-8">
            <Link
              href={`/menu?category=${activeTab}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cafe-100 hover:bg-cafe-200 text-cafe-900 text-xs font-bold transition-colors"
            >
              <span>Explore all {activeTab} creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SIGNATURE SPOTLIGHT: SPECIALTY COFFEE
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cafe-950 text-cream-100 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-warm-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-caramel/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-caramel/20 text-caramel-light border border-caramel/30 inline-block">
                The Roastery Room
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cream-100 tracking-tight leading-tight">
                Crafted with beans from high altitude volcanic soils.
              </h2>
              <p className="text-sm text-cafe-300 leading-relaxed">
                We roast in small 5kg micro-batches to preserve delicate floral aromatics and natural caramel sweetness. Whether you prefer a velvety Flat White or a 20-hour cold brew, each cup is extracted with laboratory precision.
              </p>

              <div className="space-y-2 pt-2 text-xs text-cafe-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-caramel" />
                  <span>Ethically traded direct-partnership coffee farms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-caramel" />
                  <span>Steamed whole milk & creamy barista oat milk options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-caramel" />
                  <span>Customizable temperature, sweetness, and shot size</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/menu?category=coffee"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-caramel text-cafe-950 font-bold text-xs hover:bg-caramel-light transition-all shadow-sm"
                >
                  <span>Explore Coffee Menu</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coffeeHighlights.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-cafe-900/90 border border-cafe-800 rounded-3xl p-3.5 hover:border-caramel/60 transition-all cursor-pointer group"
                >
                  <div className="relative w-full pt-[80%] rounded-2xl overflow-hidden mb-3 bg-cafe-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="250px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-cream-100 truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-caramel-light font-bold">${item.price.toFixed(2)}</span>
                    <span className="text-[11px] text-cafe-400">★ {item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          WHY RONYCAFEHUT (THE 4 PILLARS)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-caramel">
            Our Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cafe-950">
            Why RonyCafeHut?
          </h2>
          <p className="text-xs sm:text-sm text-cafe-600">
            Every detail is intentional. We believe food and coffee should nourish both body and soul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cafe-100 flex items-center justify-center text-cafe-800">
              <Coffee className="w-6 h-6 text-caramel" />
            </div>
            <h3 className="text-base font-bold text-cafe-900">Ethical Single Origin</h3>
            <p className="text-xs text-cafe-600 leading-relaxed">
              Beans harvested from sustainable smallholder family farms in Ethiopia and Colombia, roasted weekly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cafe-900">48h Sourdough Crust</h3>
            <p className="text-xs text-cafe-600 leading-relaxed">
              Naturally fermented wild yeast pizza dough for exceptional flavor, airy crust bubbles, and easy digestion.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 flex items-center justify-center text-sage-700">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cafe-900">Baked Fresh Daily</h3>
            <p className="text-xs text-cafe-600 leading-relaxed">
              Our bakers arrive at 5:00 AM every morning. 27-layer butter croissants and warm brioche right out of the oven.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cafe-900">Warm & Cozy Ambiance</h3>
            <p className="text-xs text-cafe-600 leading-relaxed">
              Gentle acoustic melodies, warm natural wood, soft lighting, and high-speed Wi-Fi for calm work and quiet conversations.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          COZY PROMOTIONAL SECTION
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-cafe-900 via-cafe-800 to-cafe-900 text-cream-100 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-warm-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel/20 text-caramel-light border border-caramel/30 text-xs font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>Online Exclusive Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-cream-100">
              Enjoy 20% Off Your Entire Order
            </h2>
            <p className="text-xs sm:text-sm text-cafe-300 leading-relaxed">
              Use promotional code <span className="font-mono font-bold text-caramel-light bg-cafe-950 px-2 py-0.5 rounded-lg border border-cafe-700">COZY20</span> at checkout for dine-in, takeaway, or direct delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/menu"
              className="px-7 py-3.5 rounded-full bg-caramel hover:bg-caramel-light text-cafe-950 font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <span>Order with Code COZY20</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          TESTIMONIALS & REVIEWS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-caramel">
            Voices from Our Tables
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cafe-950">
            Loved by Coffee & Food Lovers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-cafe-700 leading-relaxed italic">
                "The Burrata Margherita pizza paired with their Iced Shaken Brown Sugar Latte is unbeatable. It feels like stepping into a peaceful European cafe on a rainy afternoon."
              </p>
            </div>
            <div className="pt-2 border-t border-cafe-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cafe-800 text-cream-100 flex items-center justify-center font-bold text-xs">
                CL
              </div>
              <div>
                <p className="text-xs font-bold text-cafe-900">Claire Laurent</p>
                <p className="text-[11px] text-cafe-500">Regular since 2024</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-cafe-700 leading-relaxed italic">
                "Hands down the best Basque Burnt Cheesecake in town. Their online ordering is so smooth, table delivery is always prompt, and the staff remembers my name."
              </p>
            </div>
            <div className="pt-2 border-t border-cafe-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cafe-800 text-cream-100 flex items-center justify-center font-bold text-xs">
                MR
              </div>
              <div>
                <p className="text-xs font-bold text-cafe-900">Marcus Reed</p>
                <p className="text-[11px] text-cafe-500">Design Director</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-cafe-200/80 shadow-warm-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-cafe-700 leading-relaxed italic">
                "Finding authentic Masala Chai and properly folded French croissants in one place is a dream. RonyCafeHut is my go-to sanctuary for morning focus work."
              </p>
            </div>
            <div className="pt-2 border-t border-cafe-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cafe-800 text-cream-100 flex items-center justify-center font-bold text-xs">
                SP
              </div>
              <div>
                <p className="text-xs font-bold text-cafe-900">Sonia Patel</p>
                <p className="text-[11px] text-cafe-500">Author & Resident</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CALL TO ACTION
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-[2.5rem] p-10 sm:p-14 border border-cafe-200/80 shadow-warm-md max-w-4xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-cafe-100 text-cafe-900 flex items-center justify-center mx-auto shadow-sm">
            <Coffee className="w-7 h-7 text-caramel" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cafe-950 tracking-tight">
            Ready for your cozy moment?
          </h2>
          <p className="text-sm text-cafe-600 max-w-md mx-auto leading-relaxed">
            Order ahead for pickup, select your cafe table number, or have our artisan creations delivered warm to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-cafe-900 hover:bg-cafe-800 text-cream-100 font-bold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2"
            >
              <span>Explore the Complete Menu</span>
              <ArrowRight className="w-4 h-4 text-caramel-light" />
            </Link>
          </div>
        </div>
      </section>

      {/* Food Detail Customizer Modal */}
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

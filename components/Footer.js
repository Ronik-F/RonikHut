'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Phone, Mail, Clock, Heart, ArrowRight, Shield } from 'lucide-react';
import { useToast } from '@/lib/toastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Welcome to the RonyCafeHut community! Enjoy 10% off your next visit with code COFFEE10', 'success', 5000);
    setEmail('');
  };

  return (
    <footer className="bg-cafe-950 text-cream-200 border-t border-cafe-800 relative overflow-hidden">
      {/* Decorative subtle ambient circle */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-caramel/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cafe-800/80">
          
          {/* Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cafe-800 border border-cafe-700 flex items-center justify-center text-caramel-light shadow-sm">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-cream-100">
                RONY<span className="text-caramel">CAFE</span>HUT
              </span>
            </Link>
            <p className="text-sm text-cafe-300 leading-relaxed max-w-sm">
              Your cozy corner for good coffee, artisanal sourdough pizza, freshly baked pastries, and warm moments. Handcrafted with passion every single day.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-cafe-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-caramel shrink-0" />
                <span>42 Pine Wood Lane, Velvet Quarter, CA 94103</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-caramel shrink-0" />
                <span>+1 (555) 766-9223</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-caramel shrink-0" />
                <span>hello@ronycafehut.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-100 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-cafe-300">
              <li>
                <Link href="/" className="hover:text-caramel-light transition-colors">
                  Home & Story
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-caramel-light transition-colors">
                  Full Menu (80+ Items)
                </Link>
              </li>
              <li>
                <Link href="/menu?category=coffee" className="hover:text-caramel-light transition-colors">
                  Specialty Coffee
                </Link>
              </li>
              <li>
                <Link href="/menu?category=pizza" className="hover:text-caramel-light transition-colors">
                  Woodfired Pizza
                </Link>
              </li>
              <li>
                <Link href="/menu?category=pastries" className="hover:text-caramel-light transition-colors">
                  Bakery & Pastries
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-caramel-light transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-100 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-caramel" /> Opening Hours
            </h4>
            <div className="space-y-1.5 text-xs text-cafe-300">
              <div className="flex justify-between py-1 border-b border-cafe-900">
                <span className="font-medium">Mon – Thu</span>
                <span className="text-cream-100">7:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cafe-900">
                <span className="font-medium">Friday</span>
                <span className="text-cream-100">7:00 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cafe-900">
                <span className="font-medium">Saturday</span>
                <span className="text-cream-100">8:00 AM – 10:30 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium">Sunday</span>
                <span className="text-cream-100">8:00 AM – 8:30 PM</span>
              </div>
            </div>
            <p className="text-[11px] text-cafe-400 italic pt-1">
              * Kitchen closes 30 minutes before closing time.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-100 uppercase tracking-wider">Cozy Club</h4>
            <p className="text-xs text-cafe-300 leading-relaxed">
              Join our mailing club for secret seasonal specials and instant discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-cafe-900/90 border border-cafe-800 rounded-xl text-cream-100 placeholder-cafe-500 focus:outline-none focus:border-caramel transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-caramel hover:bg-caramel-dark text-cafe-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Subscribe</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cafe-400">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} RonyCafeHut. Handcrafted with{' '}
            <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" /> for coffee lovers.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/auth/signin?role=owner"
              className="flex items-center gap-1 text-cafe-500 hover:text-caramel transition-colors text-[11px]"
            >
              <Shield className="w-3 h-3" /> Cafe Owner Portal
            </Link>
            <span>Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

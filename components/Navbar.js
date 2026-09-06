'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Compass,
  Clock
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, isOwner, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartBadgeAnimate, setCartBadgeAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate cart badge when count changes
  useEffect(() => {
    if (itemCount > 0) {
      setCartBadgeAnimate(true);
      const t = setTimeout(() => setCartBadgeAnimate(false), 400);
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/menu?category=coffee', label: 'Coffee' },
    { href: '/menu?category=pizza', label: 'Artisanal Pizza' },
    { href: '/menu?category=pastries', label: 'Bakery' },
  ];

  const isOwnerRoute = pathname.startsWith('/owner');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isOwnerRoute
          ? 'bg-cream-100/90 backdrop-blur-md shadow-warm-sm border-b border-cafe-200/60 py-3.5'
          : 'bg-cream-100/60 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="RonyCafeHut Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-cafe-900 flex items-center justify-center text-cream-100 shadow-warm-sm group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 text-caramel-light" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-cafe-900 group-hover:text-cafe-700 transition-colors leading-none">
                RONY<span className="text-caramel">CAFE</span>HUT
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-cafe-600 mt-0.5">
                Artisan Roastery & Kitchen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-cafe-200/80 shadow-warm-sm backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || (link.href.startsWith('/menu') && pathname === '/menu' && !link.href.includes('?'));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cafe-900 text-cream-100 shadow-sm'
                      : 'text-cafe-700 hover:text-cafe-900 hover:bg-cafe-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Cart, Owner portal, Account */}
          <div className="flex items-center gap-2.5">
            {/* Owner Quick Access Pill (if owner) */}
            {isOwner && (
              <Link
                href="/owner/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-cafe-800 text-cream-100 rounded-full text-xs font-semibold hover:bg-cafe-900 transition-all shadow-warm-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-caramel-light" />
                <span>Owner Hub</span>
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-white border border-cafe-200/80 text-cafe-800 hover:bg-cafe-50 transition-all shadow-warm-sm flex items-center justify-center"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-cafe-800" />
              {itemCount > 0 && (
                <motion.span
                  animate={cartBadgeAnimate ? { scale: [1, 1.35, 1] } : {}}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-terracotta text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Account / User Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-cafe-200/80 hover:bg-cafe-50 transition-all shadow-warm-sm text-xs font-semibold text-cafe-900"
                  aria-label="User account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-cafe-800 text-cream-100 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-cafe-500" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-warm-xl border border-cafe-200 p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-cafe-100">
                        <p className="text-xs font-bold text-cafe-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-cafe-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cafe-100 text-cafe-700 capitalize">
                          {user.role} Account
                        </span>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cafe-800 hover:bg-cafe-50 transition-colors"
                        >
                          <Clock className="w-4 h-4 text-cafe-500" /> My Orders & History
                        </Link>
                        {isOwner && (
                          <Link
                            href="/owner/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cafe-900 bg-cafe-50 hover:bg-cafe-100 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-caramel" /> Owner Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-cafe-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-terracotta hover:bg-terracotta-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-2xl bg-white border border-cafe-200/80 text-xs font-semibold text-cafe-800 hover:bg-cafe-50 transition-all shadow-warm-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden sm:inline-flex px-4 py-2 rounded-2xl bg-cafe-900 text-cream-100 text-xs font-semibold hover:bg-cafe-800 transition-all shadow-warm-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white border border-cafe-200/80 text-cafe-800 hover:bg-cafe-50 md:hidden transition-all shadow-warm-sm"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream-50/95 backdrop-blur-lg border-b border-cafe-200 shadow-warm-lg overflow-hidden"
          >
            <div className="px-5 py-6 space-y-4">
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-cafe-800 hover:bg-cafe-100 transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <Sparkles className="w-3.5 h-3.5 text-caramel opacity-60" />
                  </Link>
                ))}
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-cafe-800 hover:bg-cafe-100 transition-colors flex items-center justify-between"
                >
                  <span>My Orders</span>
                  <Clock className="w-4 h-4 text-cafe-600" />
                </Link>
              </nav>

              <div className="pt-4 border-t border-cafe-200 flex flex-col gap-2">
                {isOwner && (
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-cafe-800 text-cream-100 text-xs font-bold text-center flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-caramel-light" /> Owner Dashboard
                  </Link>
                )}
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-4 rounded-xl bg-white border border-cafe-200 text-xs font-bold text-cafe-900 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-4 rounded-xl bg-cafe-900 text-cream-100 text-xs font-bold text-center"
                    >
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-cafe-200 text-xs font-bold text-terracotta text-center"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  Coffee,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function OwnerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isOwner, logout } = useAuth();

  // Route Protection Guard
  useEffect(() => {
    if (!loading && (!user || user.role !== 'owner')) {
      router.push('/auth/signin?role=owner');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cafe-950 flex flex-col items-center justify-center text-cream-100">
        <div className="w-12 h-12 border-4 border-cafe-700 border-t-caramel rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-cafe-300">Verifying Owner Credentials...</p>
      </div>
    );
  }

  if (!user || user.role !== 'owner') {
    return null;
  }

  const navItems = [
    { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/owner/orders', label: 'Live Orders', icon: ShoppingBag },
    { href: '/owner/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { href: '/owner/settings', label: 'Cafe Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cafe-950 text-cream-100 flex flex-col -mt-20">
      {/* Top Bar */}
      <header className="h-16 bg-cafe-900 border-b border-cafe-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/owner/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-caramel text-cafe-950 flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-cream-100 tracking-tight leading-none">
                RONY<span className="text-caramel-light">CAFE</span>HUT
              </span>
              <span className="text-[10px] font-bold text-caramel tracking-wider uppercase mt-0.5">
                Owner Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Top bar right buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-xs font-semibold text-cream-200 border border-cafe-700 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="h-6 w-[1px] bg-cafe-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-caramel text-cafe-950 font-bold flex items-center justify-center text-xs">
              {user.name?.charAt(0) || 'O'}
            </div>
            <div className="hidden md:block text-left text-xs leading-tight">
              <p className="font-bold text-cream-100">{user.name}</p>
              <p className="text-[10px] text-cafe-400">Head Administrator</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-cafe-400 hover:text-terracotta-light hover:bg-cafe-800 transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-cafe-900/70 border-r border-cafe-800/80 p-4 space-y-6 shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-caramel text-cafe-950 shadow-sm'
                      : 'text-cafe-300 hover:text-cream-100 hover:bg-cafe-800'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-cafe-950' : 'text-caramel'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Cafe Status Card */}
          <div className="p-4 rounded-2xl bg-cafe-800/60 border border-cafe-700/60 text-xs space-y-2 hidden md:block">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cafe Kitchen Open</span>
            </div>
            <p className="text-[11px] text-cafe-300">
              Orders are streaming live. Real-time updates active.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 bg-cafe-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

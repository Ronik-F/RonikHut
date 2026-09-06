'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee, ShieldCheck, User, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

function SignInContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (searchParams.get('role') === 'owner') {
      setRole('owner');
      setEmail('owner@ronycafehut.com');
      setPassword('CafeOwner123!');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password, role);
    setLoading(false);
  };

  const handleFillCustomerDemo = () => {
    setRole('customer');
    setEmail('customer@example.com');
    setPassword('Password123!');
  };

  const handleFillOwnerDemo = () => {
    setRole('owner');
    setEmail('owner@ronycafehut.com');
    setPassword('CafeOwner123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-cafe-200/80 shadow-warm-lg space-y-6"
      >
        {/* Brand Icon Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cafe-900 text-cream-100 flex items-center justify-center mx-auto shadow-warm-sm">
            <Coffee className="w-7 h-7 text-caramel-light" />
          </div>
          <h1 className="text-2xl font-extrabold text-cafe-950 tracking-tight">
            Welcome to RonyCafeHut
          </h1>
          <p className="text-xs text-cafe-600">
            Sign in to track your orders or manage the cafe
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-cafe-100/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              if (email === 'owner@ronycafehut.com') {
                setEmail('');
                setPassword('');
              }
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-white text-cafe-900 shadow-sm'
                : 'text-cafe-600 hover:text-cafe-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('owner');
              if (!email || email === 'customer@example.com') {
                setEmail('owner@ronycafehut.com');
                setPassword('CafeOwner123!');
              }
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'owner'
                ? 'bg-cafe-900 text-cream-100 shadow-sm'
                : 'text-cafe-600 hover:text-cafe-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-caramel-light" />
            <span>Cafe Owner</span>
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={role === 'owner' ? 'owner@ronycafehut.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-cafe-50 border border-cafe-200 text-cafe-900 focus:outline-none focus:border-cafe-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-cafe-50 border border-cafe-200 text-cafe-900 focus:outline-none focus:border-cafe-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-cafe-900 hover:bg-cafe-800 disabled:opacity-50 text-cream-100 font-bold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {role === 'owner' ? 'Cafe Owner' : 'Customer'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-caramel-light" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-3 border-t border-cafe-100 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cafe-500 text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillCustomerDemo}
              className="px-3 py-2 rounded-xl bg-cafe-50 hover:bg-cafe-100 border border-cafe-200 text-[11px] font-semibold text-cafe-800 text-center transition-colors"
            >
              👤 Customer Demo
            </button>
            <button
              type="button"
              onClick={handleFillOwnerDemo}
              className="px-3 py-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 border border-cafe-300 text-[11px] font-bold text-cafe-900 text-center transition-colors"
            >
              👑 Owner Demo
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-cafe-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-caramel font-bold hover:underline">
              Create customer account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-cafe-600">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}

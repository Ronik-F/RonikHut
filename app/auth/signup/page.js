'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register({ name, email, password, phone, role: 'customer' });
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-cafe-200/80 shadow-warm-lg space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cafe-900 text-cream-100 flex items-center justify-center mx-auto shadow-warm-sm">
            <Coffee className="w-7 h-7 text-caramel-light" />
          </div>
          <h1 className="text-2xl font-extrabold text-cafe-950 tracking-tight">
            Join the Cozy Club
          </h1>
          <p className="text-xs text-cafe-600">
            Create an account to track orders and save your favorite coffee recipes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-cafe-50 border border-cafe-200 text-cafe-900 focus:outline-none focus:border-cafe-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-cafe-50 border border-cafe-200 text-cafe-900 focus:outline-none focus:border-cafe-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-cafe-50 border border-cafe-200 text-cafe-900 focus:outline-none focus:border-cafe-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cafe-700">Password (Min 6 chars) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cafe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-caramel-light" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-cafe-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-caramel font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

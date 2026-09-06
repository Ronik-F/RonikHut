'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Coffee,
  Clock,
  MapPin,
  Phone,
  Mail,
  Lock,
  DollarSign,
  Save,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { useAuth } from '@/lib/authContext';

export default function OwnerSettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    name: 'RonyCafeHut',
    tagline: 'Your cozy corner for good coffee, good food, and good moments.',
    description: '',
    address: '42 Pine Wood Lane, Velvet Quarter, CA 94103',
    phone: '+1 (555) 766-9223',
    email: 'hello@ronycafehut.com',
    openingHours: {
      monday: '7:00 AM - 9:00 PM',
      tuesday: '7:00 AM - 9:00 PM',
      wednesday: '7:00 AM - 9:00 PM',
      thursday: '7:00 AM - 9:00 PM',
      friday: '7:00 AM - 10:30 PM',
      saturday: '8:00 AM - 10:30 PM',
      sunday: '8:00 AM - 8:30 PM',
    },
    taxRate: 0.0825,
    deliveryFee: 3.50,
    freeDeliveryThreshold: 45.00,
    tablesCount: 18,
    wifiName: 'RonyCafeHut_Guest',
    wifiPass: 'cozycoffee2026'
  });

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        addToast('Cafe settings saved successfully!', 'success');
      } else {
        addToast(data.error || 'Failed to save settings', 'error');
      }
    } catch (e) {
      addToast('Error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/owner-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('Owner security password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        addToast(data.error || 'Failed to update password', 'error');
      }
    } catch (e) {
      addToast('Password update failed', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-cafe-400 text-xs font-semibold">
        Loading cafe settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-caramel">
          Configuration & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-cream-100 tracking-tight">
          Cafe & Store Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: General & Operations Settings */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* General Profile */}
            <div className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider border-b border-cafe-800 pb-3 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-caramel" />
                <span>Cafe Identity & Contact</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Cafe Name</label>
                  <input
                    type="text"
                    required
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-cafe-300">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-cafe-300">Store Physical Address</label>
                  <input
                    type="text"
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Official Email</label>
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Customer Wi-Fi Network</label>
                  <input
                    type="text"
                    value={settings.wifiName || ''}
                    onChange={(e) => setSettings({ ...settings, wifiName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider border-b border-cafe-800 pb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-caramel" />
                <span>Operating Schedule</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(settings.openingHours || {}).map(([day, hours]) => (
                  <div key={day} className="space-y-1">
                    <label className="font-bold text-cafe-300 capitalize">{day}</label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          openingHours: { ...settings.openingHours, [day]: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rates & Logistics */}
            <div className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider border-b border-cafe-800 pb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-caramel" />
                <span>Tax Rates & Delivery Rules</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={((settings.taxRate || 0.0825) * 100).toFixed(2)}
                    onChange={(e) =>
                      setSettings({ ...settings, taxRate: parseFloat(e.target.value) / 100 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Standard Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={settings.deliveryFee || 3.50}
                    onChange={(e) =>
                      setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-cafe-300">Dining Table Count</label>
                  <input
                    type="number"
                    value={settings.tablesCount || 18}
                    onChange={(e) =>
                      setSettings({ ...settings, tablesCount: parseInt(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-3.5 rounded-2xl bg-caramel hover:bg-caramel-light text-cafe-950 font-extrabold text-xs transition-all shadow-warm-md flex items-center justify-center gap-2"
            >
              {savingSettings ? (
                <span>Saving Store Settings...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Cafe Settings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Owner Security & Password Changer */}
        <div className="lg:col-span-4 space-y-6">
          <form
            onSubmit={handleUpdatePassword}
            className="p-6 rounded-3xl bg-cafe-900 border border-cafe-800 shadow-warm-sm space-y-4 text-xs"
          >
            <h2 className="text-sm font-bold text-cream-100 uppercase tracking-wider border-b border-cafe-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-caramel" />
              <span>Owner Security</span>
            </h2>

            <p className="text-[11px] text-cafe-400 leading-relaxed">
              Passwords are encrypted using bcrypt salted hashing. Never store passwords in plaintext.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-cafe-300">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-cafe-300">New Password (Min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-cafe-300">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-950 border border-cafe-700 text-cream-100 focus:outline-none focus:border-caramel"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-3 rounded-xl bg-cafe-800 hover:bg-cafe-700 text-cream-100 font-bold text-xs transition-colors shadow-sm"
            >
              {savingPassword ? 'Updating Password...' : 'Update Owner Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

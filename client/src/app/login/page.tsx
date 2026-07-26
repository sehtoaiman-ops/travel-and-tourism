'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import axios from 'axios';
import { Lock, Mail, Leaf, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data && res.data.token) {
        login(res.data.token, res.data.data.user);
        if (res.data.data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen flex items-center justify-center bg-cream py-32 px-6">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200" alt="Background" className="w-full h-full object-cover opacity-15 blur-xs" />
        </div>

        <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10 shadow-luxury relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <Leaf className="w-6 h-6 text-gold" />
              <span className="font-serif text-xl tracking-wider font-semibold text-forest">ECOVOYAGE</span>
            </Link>
            <h2 className="font-serif text-2xl text-forest font-semibold">Welcome Back</h2>
            <p className="text-xs text-charcoal/60 mt-1.5 font-light">Access your premium travel dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-start space-x-2 text-red-900 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. traveler@ecovoyage.com"
                  className="w-full bg-forest/5 border border-forest/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Password</label>
                <a href="#" className="text-[10px] uppercase tracking-wider text-gold hover:text-yellow-600 font-semibold font-inter">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-forest/5 border border-forest/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-forest/5 text-xs text-charcoal/60">
            Don&apos;t have a member account?{' '}
            <Link href="/register" className="text-gold font-semibold font-inter uppercase tracking-wider hover:text-yellow-600 ml-1">
              Join Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

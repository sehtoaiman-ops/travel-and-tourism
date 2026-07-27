'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Leaf, Mail, Send, Award, ShieldCheck, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      setStatus('success');
      setMessage(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8 px-6 md:px-12 border-t border-gold/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand & Purpose */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <Leaf className="w-6 h-6 text-gold" />
            <span className="font-serif text-2xl tracking-wider font-semibold text-white">
              ECOVOYAGE
              <span className="text-gold text-sm ml-1 font-sans font-light tracking-widest">LUXURY</span>
            </span>
          </Link>
          <p className="font-sans text-sm text-cream/70 leading-relaxed font-light">
            Crafting ultra-premium journeys that preserve global ecosystems, promote carbon neutrality, and celebrate indigenous cultures. Luxury and preservation aligned.
          </p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1.5 bg-forest/20 px-3 py-1.5 rounded-full border border-gold/30">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-[10px] uppercase tracking-widest text-gold">GSTC Approved</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-forest/20 px-3 py-1.5 rounded-full border border-gold/30">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[10px] uppercase tracking-widest text-gold">B Corp Cert</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-lg text-white mb-6 tracking-wide">Explore Platform</h4>
          <ul className="space-y-3 font-sans text-sm font-light text-cream/70">
            <li>
              <Link href="/destinations" className="hover:text-gold transition-colors duration-300">Sustainable Destinations</Link>
            </li>
            <li>
              <Link href="/packages" className="hover:text-gold transition-colors duration-300">Curated Tour Packages</Link>
            </li>
            <li>
              <Link href="/hotels" className="hover:text-gold transition-colors duration-300">Eco-Resorts & Treehouses</Link>
            </li>
            <li>
              <Link href="/activities" className="hover:text-gold transition-colors duration-300">Low-Impact Activities</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gold transition-colors duration-300">Eco Travel Stories</Link>
            </li>
          </ul>
        </div>

        {/* Corporate Integrity */}
        <div>
          <h4 className="font-serif text-lg text-white mb-6 tracking-wide">Sustainability</h4>
          <ul className="space-y-3 font-sans text-sm font-light text-cream/70">
            <li>
              <Link href="/about" className="hover:text-gold transition-colors duration-300">Our Sustainability Pledge</Link>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors duration-300">Carbon Offset Metrics</a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors duration-300">Maasai & Local Support Projects</a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors duration-300">Conservation Partners</a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors duration-300">Contact Concierge</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="font-serif text-lg text-white mb-6 tracking-wide">Eco-Luxury Gazette</h4>
          <p className="font-sans text-sm font-light text-cream/70 mb-4 leading-relaxed">
            Receive seasonal sustainability briefs, priority bookings for exclusive escapes, and travel photography.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
              <input
                type="email"
                placeholder="Enter luxury email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-forest/10 border border-gold/20 rounded-full pl-12 pr-12 py-3.5 text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors duration-300 font-sans tracking-wide"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold hover:bg-yellow-600 text-charcoal rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {status === 'success' && (
              <p className="text-xs text-emerald-green font-medium animate-pulse">{message}</p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-400 font-medium">{message}</p>
            )}
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center text-xs text-cream/50 font-light font-sans tracking-widest uppercase">
        <div className="flex items-center space-x-1.5 mb-4 md:mb-0">
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span>© 2026 EcoVoyage Luxury. All Carbon Offset. 100% Climate Neutral.</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gold transition-colors">GDPR Compliance</a>
        </div>
      </div>
    </footer>
  );
};

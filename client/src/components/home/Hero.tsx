'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [budget, setBudget] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('search', destination);
    if (budget) params.append('maxPrice', budget);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920"
          alt="Cinematic Eco Landscape"
          className="w-full h-full object-cover opacity-60 scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-charcoal/40 to-charcoal/80" />
      </div>

      {/* Floating Leaves and Landscape Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* We simulate floating particles using CSS animations */}
        <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-sage/40 rounded-full blur-xs animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[60%] right-[15%] w-4 h-4 bg-gold/30 rounded-full blur-xs animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] left-[80%] w-2.5 h-2.5 bg-emerald-green/30 rounded-full blur-xs animate-bounce" style={{ animationDuration: '5s' }} />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 z-20 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="text-[10px] md:text-xs font-inter tracking-widest text-cream uppercase">
            Experience Conscious Grandeur
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-medium max-w-5xl leading-[1.1] mb-8"
        >
          Travel Responsibly.<br />
          <span className="text-gold italic">Experience Nature</span> Like Never Before.
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-cream/80 text-base md:text-xl max-w-3xl leading-relaxed mb-12 font-light"
        >
          Discover sustainable adventures, luxury eco-resorts, wildlife expeditions, mountain escapes, and unforgettable carbon-neutral journeys across the world.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
        >
          <button
            onClick={() => router.push('/packages')}
            className="bg-gold hover:bg-yellow-600 text-charcoal font-inter text-xs tracking-widest uppercase px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-luxury hover-gold-glow cursor-pointer"
          >
            Explore Tours
          </button>
          <button
            onClick={() => router.push('/hotels')}
            className="border border-white/40 hover:border-white bg-white/5 hover:bg-white/10 text-white font-inter text-xs tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
          >
            Book Resorts
          </button>
        </motion.div>

        {/* Luxury Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full max-w-5xl glass shadow-luxury rounded-3xl p-6 md:p-8"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            
            {/* Destination Input */}
            <div className="flex flex-col space-y-2.5 text-left">
              <label className="text-xs uppercase font-inter tracking-widest text-forest font-medium flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-gold" /> Destination
              </label>
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
              />
            </div>

            {/* Date Input */}
            <div className="flex flex-col space-y-2.5 text-left">
              <label className="text-xs uppercase font-inter tracking-widest text-forest font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
              />
            </div>

            {/* Guests Input */}
            <div className="flex flex-col space-y-2.5 text-left">
              <label className="text-xs uppercase font-inter tracking-widest text-forest font-medium flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-gold" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            {/* Budget Input */}
            <div className="flex flex-col space-y-2.5 text-left">
              <label className="text-xs uppercase font-inter tracking-widest text-forest font-medium flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-gold" /> Max Budget (USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
};

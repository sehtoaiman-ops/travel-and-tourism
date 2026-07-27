'use client';

import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Compass, Clock, Tag, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

function ActivitiesContent() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(res.data.data.activities || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const categories = ['Hiking', 'Safari', 'Wildlife Photography', 'Water Sports'];

  const filteredActivities = selectedCategory
    ? activities.filter((act) => act.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    : activities;

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16 animate-fade-in">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
              Low-Impact Adventures
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">
              Curated Sustainable Activities
            </h1>
            <p className="text-xs text-charcoal/60 mt-3 font-light leading-relaxed">
              Participate in carbon-offset ziplines, Maasai migration tracking, and ancient Zen photography tours, structured around environment-first guidelines.
            </p>
          </div>

          {/* Category Filter Menu */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`py-2 px-5 rounded-full text-xs font-inter uppercase tracking-widest border transition-all duration-300 ${
                selectedCategory === ''
                  ? 'bg-forest border-gold text-cream font-semibold'
                  : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
              }`}
            >
              All Activities
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-5 rounded-full text-xs font-inter uppercase tracking-widest border transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-forest border-gold text-cream font-semibold'
                    : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-forest/5" />
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white border border-forest/5 rounded-3xl overflow-hidden shadow-soft hover:border-gold/30 hover:scale-101 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full shadow-soft">
                      {act.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow space-y-3">
                    <span className="text-[10px] text-forest/50 font-semibold font-inter flex items-center">
                      <Compass className="w-3.5 h-3.5 mr-1 text-gold" /> {act.destination?.name}
                    </span>

                    <h3 className="font-serif text-lg text-forest font-bold leading-snug line-clamp-1">{act.name}</h3>
                    
                    <p className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed font-light font-sans">
                      {act.description}
                    </p>

                    <div className="pt-4 border-t border-forest/5 flex justify-between items-center text-xs mt-auto">
                      <div className="flex items-center space-x-1.5 text-forest/70 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{act.durationHours} Hours</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-widest text-forest/40 block">Cost</span>
                        <span className="font-serif font-bold text-base text-forest">${act.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-forest/5 rounded-3xl p-12 text-center text-forest shadow-soft max-w-md mx-auto">
              <Compass className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold">No Activities Found</h3>
              <p className="text-xs text-charcoal/60 mt-1 font-light">No excursions registered for this category.</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Activities() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <ActivitiesContent />
    </Suspense>
  );
}

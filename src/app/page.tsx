'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/home/Hero';
import { CarbonCalculator } from '@/components/home/CarbonCalculator';
import { AiAssistant } from '@/components/home/AiAssistant';
import { Leaf, ShieldCheck, HeartHandshake, Compass, Plus, Minus, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCarbonOpen, setIsCarbonOpen] = useState(false);
  
  const [destinations, setDestinations] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load home page data
    axios.get('http://localhost:5000/api/destinations').then(res => setDestinations(res.data.data.destinations.slice(0, 3))).catch(e => console.log(e));
    axios.get('http://localhost:5000/api/packages').then(res => setPackages(res.data.data.packages.slice(0, 3))).catch(e => console.log(e));
    axios.get('http://localhost:5000/api/hotels').then(res => setHotels(res.data.data.hotels.slice(0, 3))).catch(e => console.log(e));
    axios.get('http://localhost:5000/api/testimonials').then(res => setTestimonials(res.data.data.testimonials)).catch(e => console.log(e));
    axios.get('http://localhost:5000/api/faqs').then(res => setFaqs(res.data.data.faqs)).catch(e => console.log(e));
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <>
      <Navbar
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenCarbonCalculator={() => setIsCarbonOpen(true)}
      />

      <main className="flex-grow">
        {/* Cinematic Hero Section */}
        <Hero />

        {/* Why Choose Us Section */}
        <section className="py-24 px-6 md:px-12 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                Ethical Prestige
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-forest font-medium">
                Pioneering the Standards of Luxury Eco-Tourism
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Leaf,
                  title: '100% Carbon Neutral',
                  desc: 'Every trip carbon footprint is calculated, fully audited, and neutralised by Gold Standard conservation programs.'
                },
                {
                  icon: HeartHandshake,
                  title: 'Community Upliftment',
                  desc: 'At least 15% of all itinerary revenues flow directly to regional Maasai cooperatives and community forest guards.'
                },
                {
                  icon: ShieldCheck,
                  title: 'B Corp & GSTC Audited',
                  desc: 'Our eco lodges, local guides, and dining experiences are audited by international sustainable tourism networks.'
                },
                {
                  icon: Compass,
                  title: 'Expert Native Guides',
                  desc: 'Unlock indigenous pathways and wildlife migrations with native-born naturalists and survival photography mentors.'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-cream border border-forest/5 p-8 rounded-3xl hover:border-gold/30 hover:scale-102 transition-all duration-500 shadow-soft"
                >
                  <item.icon className="w-8 h-8 text-gold mb-6" />
                  <h3 className="font-serif text-lg text-forest font-semibold mb-3">{item.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Luxury Destinations Grid */}
        <section className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Curated Sanctuaries
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-forest font-medium">
                  Immersive Eco Destinations
                </h2>
              </div>
              <Link
                href="/destinations"
                className="group flex items-center space-x-2 text-xs uppercase tracking-widest text-forest hover:text-gold font-semibold transition-colors pt-4 md:pt-0 font-inter cursor-pointer"
              >
                <span>View All Locations</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group relative h-[450px] rounded-3xl overflow-hidden shadow-luxury flex flex-col justify-end p-8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-3">
                    <span className="bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                      Carbon Rating: {dest.carbonRating}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-medium">{dest.name}</h3>
                    <p className="text-xs text-cream/70 line-clamp-2 leading-relaxed font-sans font-light">
                      {dest.description}
                    </p>
                    <Link
                      href={`/destinations?id=${dest.id}`}
                      className="inline-flex items-center space-x-1 text-[10px] text-gold uppercase tracking-widest font-inter pt-2 hover:text-white transition-colors"
                    >
                      <span>Explore Sanctuaries</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tour Packages */}
        <section className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Preservation Expeditions
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-forest font-medium">
                  Curated Low-Carbon Tour Packages
                </h2>
              </div>
              <Link
                href="/packages"
                className="group flex items-center space-x-2 text-xs uppercase tracking-widest text-forest hover:text-gold font-semibold transition-colors pt-4 md:pt-0 font-inter cursor-pointer"
              >
                <span>Browse Catalog</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-cream rounded-3xl overflow-hidden shadow-soft border border-forest/5 hover:border-gold/30 hover:scale-101 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-forest text-cream text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                      Offset: {pkg.carbonFootprint} Tons CO₂
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gold font-bold font-inter">
                      <span>{pkg.category?.name || 'Sustainable Tour'}</span>
                      <span className="flex items-center"><Star className="w-3.5 h-3.5 text-gold mr-1" /> {pkg.rating}</span>
                    </div>

                    <h3 className="font-serif text-xl text-forest font-semibold line-clamp-1">{pkg.name}</h3>
                    <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed font-sans font-light">
                      {pkg.description}
                    </p>

                    <div className="pt-4 border-t border-forest/5 flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-forest/50">Price from</span>
                        <span className="font-serif text-2xl font-bold text-forest">${pkg.price}</span>
                      </div>
                      <Link
                        href={`/packages?id=${pkg.id}`}
                        className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[10px] tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-300 shadow-soft hover-gold-glow"
                      >
                        Book Escape
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Eco Hotels & Resorts */}
        <section className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Bio-Integrity Architecture
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-forest font-medium">
                  Premium Eco-Lodges & Canopy Resorts
                </h2>
              </div>
              <Link
                href="/hotels"
                className="group flex items-center space-x-2 text-xs uppercase tracking-widest text-forest hover:text-gold font-semibold transition-colors pt-4 md:pt-0 font-inter cursor-pointer"
              >
                <span>View All Resorts</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-soft border border-forest/5 hover:border-gold/30 hover:scale-101 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                      {hotel.type}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-forest/70 font-semibold font-inter">
                      <span>{hotel.destination?.name || 'Eco-Sanctuary'}</span>
                      <span className="flex items-center"><Star className="w-3.5 h-3.5 text-gold mr-1" /> {hotel.rating}</span>
                    </div>

                    <h3 className="font-serif text-xl text-forest font-semibold line-clamp-1">{hotel.name}</h3>
                    <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed font-sans font-light">
                      {hotel.description}
                    </p>

                    <div className="pt-4 border-t border-forest/5 flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-forest/50 font-inter">Rate per night</span>
                        <span className="font-serif text-2xl font-bold text-forest">${hotel.pricePerNight}</span>
                      </div>
                      <Link
                        href={`/hotels?id=${hotel.id}`}
                        className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[10px] tracking-widest uppercase px-5 py-3 rounded-full transition-all duration-300 shadow-soft hover-gold-glow"
                      >
                        Reserve Suite
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                True Encounters
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-forest font-medium">
                Stories of Transformative Escapes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-cream border border-forest/5 rounded-3xl p-8 md:p-12 shadow-soft hover:border-gold/30 transition-all duration-300"
                >
                  <div className="flex space-x-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-current" />
                    ))}
                  </div>

                  <p className="font-serif text-lg text-forest italic leading-relaxed mb-8">
                    &ldquo;{t.comment}&rdquo;
                  </p>

                  <div className="flex items-center space-x-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.userAvatar}
                      alt={t.userName}
                      className="w-12 h-12 rounded-full border border-gold"
                    />
                    <div>
                      <h4 className="font-sans font-bold text-sm text-forest">{t.userName}</h4>
                      <span className="text-[10px] uppercase tracking-widest text-forest/60">{t.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-12 bg-cream">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                Inquiries & Policy
              </span>
              <h2 className="font-serif text-4xl text-forest font-medium">
                Common Travel Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-forest/5 rounded-2xl overflow-hidden shadow-soft transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center text-forest font-serif text-base font-semibold focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-gold shrink-0 ml-4" />
                      ) : (
                        <Plus className="w-4 h-4 text-gold shrink-0 ml-4" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 font-sans text-xs text-charcoal/80 leading-relaxed font-light border-t border-forest/5 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sliding AI Recommendation Assistant Panel */}
        <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

        {/* Sliding Carbon Calculator Offset Panel */}
        <CarbonCalculator isOpen={isCarbonOpen} onClose={() => setIsCarbonOpen(false)} />
      </main>

      <Footer />
    </>
  );
}

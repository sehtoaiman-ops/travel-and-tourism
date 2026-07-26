'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Search, SlidersHorizontal, Leaf, Star, Sparkles, X, Calendar, Users, Check, AlertCircle } from 'lucide-react';

function PackagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '8000');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  // Selected tour for detail drawer
  const [selectedTour, setSelectedTour] = useState<any | null>(null);
  const [tourDetailOpen, setTourDetailOpen] = useState(false);

  // Booking form state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingGuests, setBookingGuests] = useState('2');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;

      const res = await axios.get('http://localhost:5000/api/packages', { params });
      setPackages(res.data.data.packages || []);
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, maxPrice, selectedDifficulty]);

  // Load tour detail if query param exists
  useEffect(() => {
    const pkgId = searchParams.get('id');
    if (pkgId) {
      axios.get(`http://localhost:5000/api/packages/${pkgId}`).then((res) => {
        setSelectedTour(res.data.data.package);
        setTourDetailOpen(true);
      });
    }
  }, [searchParams]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!bookingDate) {
      setBookingError('Please select a target travel date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await axios.post('http://localhost:5000/api/bookings/create', {
        packageId: selectedTour.id,
        guestsCount: parseInt(bookingGuests),
        checkInDate: bookingDate,
        checkOutDate: new Date(new Date(bookingDate).getTime() + selectedTour.durationDays * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (res.data && res.data.data.checkoutUrl) {
        router.push(res.data.data.checkoutUrl);
      }
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Failed to initialize reservation.');
    } finally {
      setBookingLoading(false);
    }
  };

  const difficultyLevels = ['Easy', 'Moderate', 'Challenging', 'Extreme'];
  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'Luxury Escape', slug: 'luxury' },
    { name: 'Eco Tours', slug: 'eco' },
    { name: 'Adventure Safari', slug: 'adventure' },
    { name: 'Honeymoon', slug: 'honeymoon' },
    { name: 'Solo Travel', slug: 'solo' },
    { name: 'Family Tours', slug: 'family' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
              Low-Impact Catalog
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">
              Sustainable Luxury Expeditions
            </h1>
            <p className="text-xs text-charcoal/60 mt-3 font-light leading-relaxed">
              Browse carbon-audited itineraries designed around solar retreats, wildlife restoration projects, and community preservation cooperatives.
            </p>
          </div>

          {/* Filtering Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="glass rounded-3xl p-6 h-fit space-y-8 shadow-soft">
              <div className="flex items-center space-x-2 pb-4 border-b border-forest/10">
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                <h3 className="font-serif text-base text-forest font-semibold">Refine Options</h3>
              </div>

              {/* Text Search */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Keywords</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-forest/5 border border-forest/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Experience Type</label>
                <div className="flex flex-col space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-left text-xs py-2 px-3 rounded-lg transition-colors font-sans flex justify-between items-center ${
                        selectedCategory === cat.slug
                          ? 'bg-forest/10 text-forest font-bold'
                          : 'text-charcoal/70 hover:bg-forest/5'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs uppercase font-inter tracking-widest text-forest font-semibold">
                  <span>Max Price (USD)</span>
                  <span className="text-gold font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="12000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-gold bg-forest/10 h-1 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-forest/5 border border-forest/10 rounded-xl px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                >
                  <option value="">All Difficulties</option>
                  {difficultyLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Tour Cards Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-forest/5" />
                  ))}
                </div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedTour(pkg);
                        setTourDetailOpen(true);
                        // Push parameter without hard reload
                        router.push(`/packages?id=${pkg.id}`, { scroll: false });
                      }}
                      className="bg-white rounded-3xl overflow-hidden shadow-soft border border-forest/5 hover:border-gold/30 hover:scale-101 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                    >
                      <div className="relative h-60 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-forest text-cream text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full flex items-center space-x-1 shadow-soft">
                          <Leaf className="w-3.5 h-3.5 text-gold" />
                          <span>Offset: {pkg.carbonFootprint}t CO₂</span>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-grow space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gold font-bold font-inter">
                          <span>{pkg.category?.name}</span>
                          <span className="flex items-center"><Star className="w-3.5 h-3.5 text-gold mr-1" /> {pkg.rating}</span>
                        </div>

                        <h3 className="font-serif text-lg text-forest font-bold leading-snug line-clamp-1">{pkg.name}</h3>
                        <p className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed font-sans font-light">
                          {pkg.description}
                        </p>

                        <div className="pt-4 border-t border-forest/5 flex justify-between items-center mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-forest/50">Price from</span>
                            <span className="font-serif text-xl font-bold text-forest">${pkg.price}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-gold font-inter font-semibold">
                            {pkg.durationDays} Days / {pkg.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-forest/5 rounded-3xl p-12 text-center text-forest shadow-soft">
                  <Leaf className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-bold">No Tours Found</h3>
                  <p className="text-xs text-charcoal/60 mt-1 font-light">Try expanding your budget parameters or removing tags.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Cinematic Details & Booking Drawer */}
        {tourDetailOpen && selectedTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl h-screen bg-cream border-l border-gold/20 shadow-luxury flex flex-col overflow-y-auto animate-slide-in relative">
              
              {/* Cover image */}
              <div className="relative h-72 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTour.image}
                  alt={selectedTour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent" />
                <button
                  onClick={() => {
                    setTourDetailOpen(false);
                    setBookingOpen(false);
                    router.push('/packages', { scroll: false });
                  }}
                  className="absolute top-6 right-6 bg-charcoal/40 text-white hover:bg-charcoal p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-8 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-forest text-cream text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                      Offset Index: {selectedTour.carbonFootprint}t CO₂
                    </span>
                    <h2 className="font-serif text-2xl text-forest font-semibold mt-3">{selectedTour.name}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-forest/50 block">Price Per Guest</span>
                    <span className="font-serif text-3xl font-bold text-forest">${selectedTour.price}</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal/70 leading-relaxed font-sans font-light">
                  {selectedTour.description}
                </p>

                {/* Highlights accordion/list */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-inter tracking-widest text-forest font-semibold">Expedition Highlights</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTour.highlights.split(';').map((hl: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-forest/5">
                        <Check className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-xs text-forest/80 font-medium font-sans">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-inter tracking-widest text-emerald-green font-bold">Inclusions</h5>
                    <ul className="space-y-1.5 text-xs text-charcoal/70 list-disc pl-4 font-light font-sans">
                      {selectedTour.inclusions.split(';').map((inc: string, idx: number) => (
                        <li key={idx}>{inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-inter tracking-widest text-red-800 font-bold">Exclusions</h5>
                    <ul className="space-y-1.5 text-xs text-charcoal/70 list-disc pl-4 font-light font-sans">
                      {selectedTour.exclusions.split(';').map((exc: string, idx: number) => (
                        <li key={idx}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-inter tracking-widest text-forest font-semibold">Itinerary Days</h4>
                  <div className="space-y-2">
                    {selectedTour.itinerary.split(';').map((day: string, idx: number) => (
                      <div key={idx} className="bg-white border border-forest/5 p-4 rounded-xl flex items-start space-x-4">
                        <span className="bg-gold/10 text-gold text-xs font-bold font-inter px-3 py-1.5 rounded-lg shrink-0">Day {idx+1}</span>
                        <p className="text-xs text-charcoal/80 leading-relaxed font-sans">{day}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                {selectedTour.reviews && selectedTour.reviews.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-inter tracking-widest text-forest font-semibold">Traveler Reviews</h4>
                    <div className="space-y-3">
                      {selectedTour.reviews.map((rev: any) => (
                        <div key={rev.id} className="bg-white border border-forest/5 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-forest font-bold">{rev.user?.name}</span>
                            <div className="flex">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-gold fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-charcoal/70 italic">&ldquo;{rev.comment}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booking form widget trigger */}
                {!bookingOpen ? (
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow mt-8 cursor-pointer"
                  >
                    Initiate Reservation
                  </button>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="bg-white border border-gold/30 rounded-2xl p-6 space-y-4 mt-8 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-forest/5 pb-3">
                      <h4 className="font-serif text-sm font-semibold text-forest">Reservation Configurator</h4>
                      <button
                        type="button"
                        onClick={() => setBookingOpen(false)}
                        className="text-xs text-forest/50 hover:text-forest"
                      >
                        Cancel
                      </button>
                    </div>

                    {bookingError && (
                      <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex items-start space-x-2 text-red-900">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[11px]">{bookingError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> Start Date
                        </label>
                        <select
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-forest/5 border border-forest/10 rounded-xl px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                          required
                        >
                          <option value="">Select Date</option>
                          {selectedTour.dates.split(';').map((dt: string) => (
                            <option key={dt} value={dt}>{dt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Guests */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1 text-gold" /> Guest Count
                        </label>
                        <select
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(e.target.value)}
                          className="w-full bg-forest/5 border border-forest/10 rounded-xl px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="6">6 Guests</option>
                        </select>
                      </div>
                    </div>

                    {/* Cost Estimation */}
                    <div className="bg-forest/5 p-4 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-forest/70 font-sans">Estimated Booking Total:</span>
                      <span className="font-serif text-lg font-bold text-forest">
                        ${selectedTour.price * parseInt(bookingGuests)}
                      </span>
                    </div>

                    {/* Book Trigger */}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-gold hover:bg-yellow-600 text-charcoal font-semibold font-inter text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-300 shadow-soft cursor-pointer"
                    >
                      {bookingLoading ? 'Redirecting to Stripe...' : 'Proceed to Checkout Billing'}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}

export default function Packages() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <PackagesContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import axios from 'axios';
import { User, Calendar, MapPin, Heart, Leaf, QrCode, Trash2, ShieldCheck, Sparkles, Award } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isAuthenticated, loading, refreshUser } = useAuth();
  
  // Tab control: bookings, wishlist, profile, carbon
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bookings');
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [myWishlist, setMyWishlist] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const fetchDashboardData = async () => {
    if (!token) return;
    setBookingsLoading(true);
    try {
      const bRes = await axios.get('http://localhost:5000/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBookings(bRes.data.data.bookings || []);

      const wRes = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyWishlist(wRes.data.data.wishlist || []);
    } catch (error) {
      console.error('Failed to load traveler details:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const handleRemoveWishlist = async (pkgId: string) => {
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/api/wishlist/toggle', { packageId: pkgId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // refresh wishlist
      fetchDashboardData();
    } catch (e) {
      console.log(e);
    }
  };

  // Calculate carbon metrics
  const confirmedBookings = myBookings.filter(b => b.status === 'CONFIRMED');
  const totalOffsetTons = confirmedBookings.reduce((sum, b) => {
    if (b.package) {
      return sum + b.package.carbonFootprint;
    }
    return sum;
  }, 0);

  if (loading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { name: 'reservations', label: 'My Bookings', icon: Calendar },
    { name: 'wishlist', label: 'Saved Trips', icon: Heart },
    { name: 'carbon', label: 'Carbon Certificates', icon: Leaf },
    { name: 'profile', label: 'Account Profile', icon: User },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Menu */}
          <div className="glass rounded-3xl p-6 h-fit space-y-6 shadow-soft">
            <div className="flex items-center space-x-4 pb-4 border-b border-forest/10">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-base text-forest font-semibold leading-none">{user?.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold font-inter mt-1.5 block">
                  {user?.role} Member
                </span>
              </div>
            </div>

            <nav className="flex flex-col space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`text-left text-xs py-3 px-4 rounded-xl transition-all duration-300 font-sans font-medium flex items-center space-x-3 uppercase tracking-widest ${
                      activeTab === tab.name
                        ? 'bg-forest border border-gold text-cream shadow-soft'
                        : 'text-forest/70 hover:bg-forest/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === tab.name ? 'text-gold' : 'text-forest'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Dashboard Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="glass rounded-3xl p-8 space-y-6 shadow-soft">
                <h2 className="font-serif text-2xl text-forest font-semibold">Your Reservations</h2>
                <div className="space-y-6">
                  {myBookings.length > 0 ? (
                    myBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white border border-forest/5 rounded-2xl p-6 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className={`text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full ${
                              booking.status === 'CONFIRMED'
                                ? 'bg-emerald-green/10 text-emerald-green border border-emerald-green/20'
                                : 'bg-gold/10 text-gold border border-gold/20'
                            }`}>
                              {booking.status}
                            </span>
                            <span className="font-mono text-[10px] text-charcoal/50">Ref: {booking.id}</span>
                          </div>

                          <h3 className="font-serif text-lg text-forest font-bold">
                            {booking.package?.name || booking.hotel?.name || 'Eco Expedition'}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-xs text-charcoal/60 font-sans">
                            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gold" /> {booking.package?.destination?.name || booking.hotel?.destination?.name || 'Varies'}</span>
                            <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> {new Date(booking.checkInDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-widest text-forest/50 block font-inter">Total Paid</span>
                            <span className="font-serif text-lg font-bold text-forest">${booking.totalPrice}</span>
                          </div>

                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => {
                                alert(`Ticket Code: ${booking.qrCode}\nPrint Invoice copy.`);
                              }}
                              className="bg-forest/5 hover:bg-forest hover:text-cream border border-forest/10 p-3 rounded-xl transition-all duration-300"
                              title="View Ticket QR"
                            >
                              <QrCode className="w-4 h-4 text-forest" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-forest/70">
                      <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h3 className="font-serif text-base font-bold">No Bookings Yet</h3>
                      <p className="text-xs text-charcoal/50 mt-1 font-light">Explore our low-carbon tours and reserve your next escape.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="glass rounded-3xl p-8 space-y-6 shadow-soft">
                <h2 className="font-serif text-2xl text-forest font-semibold">Saved Trips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myWishlist.length > 0 ? (
                    myWishlist.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-forest/5 rounded-2xl overflow-hidden shadow-soft flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.package.image} alt={item.package.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 space-y-3 flex-grow flex flex-col">
                          <h3 className="font-serif text-sm font-semibold text-forest leading-snug line-clamp-1">
                            {item.package.name}
                          </h3>
                          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-forest/50 font-inter mt-auto">
                            <span>${item.package.price}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => router.push(`/packages?id=${item.package.id}`)}
                                className="text-gold hover:text-yellow-600 font-bold"
                              >
                                Book Now
                              </button>
                              <button
                                onClick={() => handleRemoveWishlist(item.package.id)}
                                className="text-red-700 hover:text-red-950"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 text-forest/70">
                      <Heart className="w-12 h-12 text-gold mx-auto mb-4" />
                      <h3 className="font-serif text-base font-bold">Your Wishlist is Empty</h3>
                      <p className="text-xs text-charcoal/50 mt-1 font-light">Bookmark luxury packages to reference them here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CARBON TAB */}
            {activeTab === 'carbon' && (
              <div className="glass rounded-3xl p-8 space-y-6 shadow-soft">
                <div className="flex justify-between items-center border-b border-forest/5 pb-4">
                  <h2 className="font-serif text-2xl text-forest font-semibold flex items-center space-x-2.5">
                    <Leaf className="w-6 h-6 text-gold animate-bounce" />
                    <span>Carbon Offsets</span>
                  </h2>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-forest/50 font-inter">Total Offset Metric</span>
                    <span className="font-serif text-2xl font-bold text-forest block">{totalOffsetTons.toFixed(2)} Tons CO₂</span>
                  </div>
                </div>

                {confirmedBookings.length > 0 ? (
                  <div className="space-y-6">
                    {/* The Climate Neutrality Certificate */}
                    <div className="bg-gradient-to-br from-forest to-emerald-green border border-gold/40 rounded-3xl p-8 md:p-10 text-cream relative overflow-hidden shadow-luxury">
                      <div className="absolute right-6 top-6 opacity-10">
                        <Award className="w-48 h-48 text-gold" />
                      </div>
                      
                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-6 h-6 text-gold" />
                          <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold">Climate Neutral Certification</span>
                        </div>

                        <h3 className="font-serif text-3xl font-bold leading-tight max-w-lg text-white">
                          Certificate of Travel Neutrality
                        </h3>
                        
                        <p className="text-xs text-cream/80 font-sans max-w-md leading-relaxed font-light">
                          This document certifies that traveler <span className="font-bold text-gold">{user?.name}</span> has fully neutralized the flight and ground carbon emissions of their eco tours, backed by verified Gold Standard community preservation projects.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-cream/10">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-cream/40 block font-inter">Certified Offset</span>
                            <span className="font-serif text-xl font-bold text-gold">{totalOffsetTons.toFixed(2)} Metric Tons CO₂</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-cream/40 block font-inter">Tree equivalent</span>
                            <span className="font-serif text-xl font-bold text-white">{Math.ceil(totalOffsetTons * 8)} Trees Planted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-forest/70">
                    <Award className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="font-serif text-base font-bold">No Certificates Logged</h3>
                    <p className="text-xs text-charcoal/50 mt-1 font-light">Certificates generate automatically once payments are validated.</p>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="glass rounded-3xl p-8 space-y-6 shadow-soft">
                <h2 className="font-serif text-2xl text-forest font-semibold">Account Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1 bg-white p-5 rounded-2xl border border-forest/5 shadow-soft">
                    <span className="text-[10px] uppercase tracking-widest text-forest/50 font-inter">Full Name</span>
                    <p className="font-bold text-forest">{user?.name}</p>
                  </div>
                  <div className="space-y-1 bg-white p-5 rounded-2xl border border-forest/5 shadow-soft">
                    <span className="text-[10px] uppercase tracking-widest text-forest/50 font-inter">Email Address</span>
                    <p className="font-bold text-forest">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

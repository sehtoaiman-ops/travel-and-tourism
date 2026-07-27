'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Home, Star, Sparkles, X, Calendar, Users, Check, AlertCircle, ArrowLeft } from 'lucide-react';

function HotelsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected resort state
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [hotelDetailOpen, setHotelDetailOpen] = useState(false);

  // Booking room state
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/hotels');
      setHotels(res.data.data.hotels || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    const hotelId = searchParams.get('id');
    if (hotelId) {
      axios.get(`http://localhost:5000/api/hotels/${hotelId}`).then((res) => {
        setSelectedHotel(res.data.data.hotel);
        setHotelDetailOpen(true);
      });
    }
  }, [searchParams]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!checkIn || !checkOut) {
      setBookingError('Please specify check-in and check-out dates.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookings/create',
        {
          hotelId: selectedHotel.id,
          roomId: selectedRoom.id,
          guestsCount: parseInt(guestsCount),
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data && res.data.data.checkoutUrl) {
        router.push(res.data.data.checkoutUrl);
      }
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Failed to initialize reservation.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getDaysCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {!hotelDetailOpen ? (
            /* Resort Listings Grid */
            <div className="space-y-16 animate-fade-in">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Conscious Luxury Lodging
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">
                  Eco Lodges & High-End Resorts
                </h1>
                <p className="text-xs text-charcoal/60 mt-3 font-light leading-relaxed">
                  Experience architectural masterpieces featuring solar arrays, rainwater capture cycles, and organic farm-to-table restaurants.
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-forest/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setHotelDetailOpen(true);
                        router.push(`/hotels?id=${hotel.id}`, { scroll: false });
                      }}
                      className="bg-white rounded-3xl overflow-hidden shadow-soft border border-forest/5 hover:border-gold/30 hover:scale-101 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full shadow-soft">
                          {hotel.type}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-grow space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-forest/70 font-semibold font-inter">
                          <span>{hotel.destination?.name}</span>
                          <span className="flex items-center"><Star className="w-3.5 h-3.5 text-gold mr-1" /> {hotel.rating}</span>
                        </div>

                        <h3 className="font-serif text-xl text-forest font-bold line-clamp-1 leading-snug">{hotel.name}</h3>
                        <p className="text-xs text-charcoal/60 line-clamp-3 leading-relaxed font-sans font-light">
                          {hotel.description}
                        </p>

                        <div className="pt-4 border-t border-forest/5 flex justify-between items-center mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-forest/50 font-inter">Rate per night</span>
                            <span className="font-serif text-xl font-bold text-forest">${hotel.pricePerNight}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-gold font-inter font-semibold">
                            Reserve Suite
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Resort Details View */
            <div className="space-y-12 animate-fade-in">
              <button
                onClick={() => {
                  setHotelDetailOpen(false);
                  setBookingOpen(false);
                  setSelectedRoom(null);
                  router.push('/hotels', { scroll: false });
                }}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-forest font-bold hover:text-gold transition-colors font-inter"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Resorts</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-luxury">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedHotel.image}
                    alt={selectedHotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 bg-gold text-charcoal text-[10px] uppercase tracking-widest font-bold font-inter px-4 py-1.5 rounded-full shadow-soft">
                    {selectedHotel.type}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold">{selectedHotel.destination?.name}</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">{selectedHotel.name}</h1>
                  </div>

                  <p className="text-sm text-charcoal/80 leading-relaxed font-sans font-light">
                    {selectedHotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-inter tracking-widest text-forest font-semibold">Eco-Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedHotel.amenities.split(';').map((am: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-forest/5">
                          <Check className="w-4 h-4 text-gold shrink-0" />
                          <span className="text-xs text-forest/80 font-medium font-sans">{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Room selections & Reservation widgets */}
              <div className="space-y-6 pt-12 border-t border-forest/10">
                <h3 className="font-serif text-2xl text-forest font-semibold">Luxury Suites & Villas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {selectedHotel.rooms && selectedHotel.rooms.map((room: any) => (
                    <div
                      key={room.id}
                      className="bg-white border border-forest/5 rounded-3xl overflow-hidden shadow-soft flex flex-col h-full"
                    >
                      <div className="h-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={room.image} alt={room.type} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 space-y-4 flex-grow flex flex-col">
                        <h4 className="font-serif text-base font-bold text-forest">{room.type}</h4>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {room.amenities.split(';').map((am: string, i: number) => (
                            <span key={i} className="bg-forest/5 text-forest text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                              {am}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-forest/5 flex justify-between items-center mt-auto">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-forest/50 block font-inter">Per Night</span>
                            <span className="font-serif text-lg font-bold text-forest">${room.pricePerNight}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setBookingOpen(true);
                            }}
                            className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[9px] tracking-widest uppercase px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Booking Room Modal */}
                {bookingOpen && selectedRoom && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm px-6">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-gold/30 p-8 shadow-luxury relative animate-slide-in">
                      <button
                        onClick={() => {
                          setBookingOpen(false);
                          setSelectedRoom(null);
                        }}
                        className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-forest/5 text-forest/70 hover:text-forest"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-4">
                        <div className="border-b border-forest/5 pb-3">
                          <span className="text-[9px] uppercase tracking-widest font-inter text-gold font-bold">Lodge Suite Booking</span>
                          <h4 className="font-serif text-lg font-semibold text-forest mt-1">{selectedRoom.type}</h4>
                        </div>

                        {bookingError && (
                          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 flex items-start space-x-2 text-red-900">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span className="text-[11px]">{bookingError}</span>
                          </div>
                        )}

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block">Check-In Date</label>
                            <input
                              type="date"
                              value={checkIn}
                              onChange={(e) => setCheckIn(e.target.value)}
                              className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                              required
                            />
                          </div>

                          <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block">Check-Out Date</label>
                            <input
                              type="date"
                              value={checkOut}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                              required
                            />
                          </div>

                          <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase font-inter tracking-widest text-forest font-semibold block">Guests</label>
                            <select
                              value={guestsCount}
                              onChange={(e) => setGuestsCount(e.target.value)}
                              className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                            >
                              <option value="1">1 Guest</option>
                              <option value="2">2 Guests</option>
                              <option value="4">4 Guests</option>
                            </select>
                          </div>

                          {/* Calculated lodging total */}
                          {checkIn && checkOut && (
                            <div className="bg-forest/5 p-4 rounded-xl flex justify-between items-center text-xs">
                              <span>Estimated Nights: {getDaysCount()} Nights</span>
                              <span className="font-serif text-base font-bold text-forest">
                                Total: ${selectedRoom.pricePerNight * getDaysCount()}
                              </span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-3.5 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow cursor-pointer"
                          >
                            {bookingLoading ? 'Redirecting...' : 'Proceed to Billing'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Hotels() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}

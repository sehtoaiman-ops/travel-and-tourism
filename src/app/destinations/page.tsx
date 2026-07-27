'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MapPin, Globe, Leaf, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function DestinationsContent() {
  const searchParams = useSearchParams();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState('');
  
  // Details view state
  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/destinations');
      setDestinations(res.data.data.destinations || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    const destId = searchParams.get('id');
    if (destId) {
      axios.get(`http://localhost:5000/api/destinations/${destId}`).then((res) => {
        setSelectedDest(res.data.data.destination);
        setDetailOpen(true);
      });
    }
  }, [searchParams]);

  const continents = ['Asia', 'Europe', 'Africa', 'Australia', 'North America', 'South America'];

  const filteredDestinations = selectedContinent
    ? destinations.filter((d) => d.country?.continent === selectedContinent)
    : destinations;

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {!detailOpen ? (
            /* Catalog Grid */
            <div className="space-y-16 animate-fade-in">
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-[11px] uppercase tracking-widest font-inter text-gold font-bold mb-3 block">
                  Global Sanctuaries
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">
                  Preserved Regions & Eco-Havens
                </h1>
                <p className="text-xs text-charcoal/60 mt-3 font-light leading-relaxed">
                  Discover car-free Alpine villages, canopy biospheres, and community conservancies committed to absolute biodiversity preservation.
                </p>
              </div>

              {/* Continent Filter Menu */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedContinent('')}
                  className={`py-2 px-5 rounded-full text-xs font-inter uppercase tracking-widest border transition-all duration-300 ${
                    selectedContinent === ''
                      ? 'bg-forest border-gold text-cream font-semibold'
                      : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                  }`}
                >
                  All Continents
                </button>
                {continents.map((cont) => (
                  <button
                    key={cont}
                    onClick={() => setSelectedContinent(cont)}
                    className={`py-2 px-5 rounded-full text-xs font-inter uppercase tracking-widest border transition-all duration-300 ${
                      selectedContinent === cont
                        ? 'bg-forest border-gold text-cream font-semibold'
                        : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                    }`}
                  >
                    {cont}
                  </button>
                ))}
              </div>

              {/* Grid cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-forest/5" />
                  ))}
                </div>
              ) : filteredDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={async () => {
                        const res = await axios.get(`http://localhost:5000/api/destinations/${dest.id}`);
                        setSelectedDest(res.data.data.destination);
                        setDetailOpen(true);
                      }}
                      className="group relative h-[450px] rounded-3xl overflow-hidden shadow-luxury flex flex-col justify-end p-8 cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />

                      <div className="relative z-10 space-y-3">
                        <span className="bg-gold text-charcoal text-[9px] uppercase tracking-widest font-bold font-inter px-3 py-1 rounded-full">
                          Carbon Index: {dest.carbonRating}
                        </span>
                        <h3 className="font-serif text-2xl text-white font-medium">{dest.name}</h3>
                        <p className="text-xs text-cream/70 line-clamp-2 leading-relaxed font-sans font-light">
                          {dest.description}
                        </p>
                        <span className="inline-flex items-center space-x-1.5 text-[10px] text-gold uppercase tracking-widest font-inter pt-2 hover:text-white transition-colors">
                          <span>Verify Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-forest/5 rounded-3xl p-12 text-center text-forest shadow-soft max-w-md mx-auto">
                  <Globe className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-bold">No Destinations Found</h3>
                  <p className="text-xs text-charcoal/60 mt-1 font-light">No properties are currently registered for this continent.</p>
                </div>
              )}
            </div>
          ) : (
            /* Destination Details View */
            <div className="space-y-12 animate-fade-in">
              <button
                onClick={() => setDetailOpen(false)}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-forest font-bold hover:text-gold transition-colors font-inter"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Destinations</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-luxury">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedDest.image}
                    alt={selectedDest.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 bg-forest text-cream text-[10px] uppercase tracking-widest font-bold font-inter px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-soft">
                    <Leaf className="w-4 h-4 text-gold animate-bounce" />
                    <span>Bio-Carbon Index: {selectedDest.carbonRating}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold">{selectedDest.country?.name}</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-forest font-semibold">{selectedDest.name}</h1>
                  </div>

                  <p className="text-sm text-charcoal/80 leading-relaxed font-sans font-light">
                    {selectedDest.description}
                  </p>

                  <div className="bg-forest/5 border border-forest/10 p-5 rounded-2xl flex items-center space-x-3 text-xs text-forest font-sans">
                    <MapPin className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <span className="font-bold block">Geothermal Coordinates:</span>
                      <span className="font-mono text-charcoal/70">Latitude: {selectedDest.latitude}° / Longitude: {selectedDest.longitude}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Hotels and Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-forest/10">
                {/* Packages list */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-forest font-semibold">Expeditions In {selectedDest.name}</h3>
                  <div className="space-y-3">
                    {selectedDest.packages && selectedDest.packages.length > 0 ? (
                      selectedDest.packages.map((pkg: any) => (
                        <div key={pkg.id} className="bg-white border border-forest/5 p-5 rounded-2xl shadow-soft flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-gold font-bold block uppercase tracking-wider">{pkg.difficulty}</span>
                            <span className="font-serif text-sm font-semibold text-forest leading-snug line-clamp-1">{pkg.name}</span>
                          </div>
                          <Link
                            href={`/packages?id=${pkg.id}`}
                            className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[9px] tracking-widest uppercase px-4 py-2 rounded-full transition-colors cursor-pointer"
                          >
                            Explore
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-forest/50 italic">No tour packages are registered for this sanctuary.</p>
                    )}
                  </div>
                </div>

                {/* Resorts list */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-forest font-semibold">Eco-Resorts & Canopy Lodging</h3>
                  <div className="space-y-3">
                    {selectedDest.hotels && selectedDest.hotels.length > 0 ? (
                      selectedDest.hotels.map((hotel: any) => (
                        <div key={hotel.id} className="bg-white border border-forest/5 p-5 rounded-2xl shadow-soft flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-gold font-bold block uppercase tracking-wider">{hotel.type}</span>
                            <span className="font-serif text-sm font-semibold text-forest leading-snug line-clamp-1">{hotel.name}</span>
                          </div>
                          <Link
                            href={`/hotels?id=${hotel.id}`}
                            className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[9px] tracking-widest uppercase px-4 py-2 rounded-full transition-colors cursor-pointer"
                          >
                            Reserve
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-forest/50 italic">No luxury resorts are registered for this sanctuary.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Destinations() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <DestinationsContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { X, Leaf, HelpCircle, Trees, ShieldAlert, Sparkles } from 'lucide-react';

interface CarbonCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ isOpen, onClose }) => {
  const [transportType, setTransportType] = useState('CAR');
  const [flightHours, setFlightHours] = useState(4);
  const [accommodationDays, setAccommodationDays] = useState(5);
  
  const [result, setResult] = useState<{
    totalCarbonTons: number;
    offsetCostUsd: number;
    recommendedTreesCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNeutralized, setIsNeutralized] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/carbon/calculate', {
        transportType,
        flightHours,
        accommodationDays,
      });
      setResult(res.data.data);
      setIsNeutralized(false);
    } catch (error) {
      console.error('Carbon calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal/50 backdrop-blur-sm">
      <div className="w-full max-w-lg h-screen bg-cream border-l border-gold/20 shadow-luxury flex flex-col p-8 overflow-y-auto animate-slide-in">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-forest/10 pb-6 mb-6">
          <div className="flex items-center space-x-2.5">
            <Leaf className="w-6 h-6 text-gold animate-bounce" />
            <h3 className="font-serif text-2xl text-forest font-semibold">Carbon Neutralizer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-forest/5 text-forest/70 hover:text-forest transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Blurb */}
        <div className="bg-forest/5 border border-forest/10 rounded-2xl p-4 flex items-start space-x-3 mb-6">
          <HelpCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <p className="text-xs text-forest/90 leading-relaxed font-sans">
            Our calculator estimates your trip&apos;s CO2 footprint covering flights, transit, and lodging. Neutralization contributions support community reforestation and gold-standard solar arrays.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6 mb-8">
          {/* Flight Hours Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs uppercase font-inter tracking-widest text-forest font-semibold">
              <span>Flight Duration</span>
              <span className="text-gold font-bold">{flightHours} Hours</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={flightHours}
              onChange={(e) => setFlightHours(parseInt(e.target.value))}
              className="w-full accent-gold bg-forest/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Accommodation Days Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs uppercase font-inter tracking-widest text-forest font-semibold">
              <span>Lodging Duration</span>
              <span className="text-gold font-bold">{accommodationDays} Nights</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={accommodationDays}
              onChange={(e) => setAccommodationDays(parseInt(e.target.value))}
              className="w-full accent-gold bg-forest/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Local Transport Type */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">
              Ground Transportation
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'TRAIN', label: 'E-Train' },
                { type: 'ELECTRIC', label: 'EV Taxi' },
                { type: 'CAR', label: 'SUV SUV' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setTransportType(item.type)}
                  className={`py-3 px-2 text-center text-xs font-inter tracking-wider rounded-xl border transition-all duration-300 ${
                    transportType === item.type
                      ? 'bg-forest border-gold text-cream'
                      : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Trigger */}
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow cursor-pointer"
          >
            {loading ? 'Analyzing Travel Metrics...' : 'Calculate Offset Footprint'}
          </button>
        </div>

        {/* Results display */}
        {result && (
          <div className="border-t border-forest/10 pt-6 animate-fade-in space-y-6">
            
            {/* Emission statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-forest/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-forest/60 block mb-1">CO₂ Tons</span>
                <span className="font-serif text-2xl font-bold text-forest">{result.totalCarbonTons}t</span>
              </div>
              <div className="bg-white border border-forest/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-forest/60 block mb-1">Offset Fee</span>
                <span className="font-serif text-2xl font-bold text-gold">${result.offsetCostUsd}</span>
              </div>
              <div className="bg-white border border-forest/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-forest/60 block mb-1">Tree Equivalent</span>
                <span className="font-serif text-2xl font-bold text-forest flex items-center justify-center space-x-1">
                  <Trees className="w-4 h-4 text-emerald-green" />
                  <span>{result.recommendedTreesCount}</span>
                </span>
              </div>
            </div>

            {/* Certifications and Action */}
            {isNeutralized ? (
              <div className="bg-emerald-green/10 border border-emerald-green/30 rounded-2xl p-6 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-gold mx-auto animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-forest">Trip Offset Confirmed!</h4>
                <p className="text-xs text-forest/80 font-sans leading-relaxed">
                  Thank you for keeping travel carbon-neutral. Your certificate of neutralization has been logged and sent to your account profile.
                </p>
              </div>
            ) : (
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <p className="text-[11px] text-charcoal/80 leading-relaxed font-sans">
                    EcoVoyage transfers 100% of neutralization fees directly to our certified reforestation and solar pipeline projects.
                  </p>
                </div>
                <button
                  onClick={() => setIsNeutralized(true)}
                  className="w-full bg-gold hover:bg-yellow-600 text-charcoal font-semibold font-inter text-xs tracking-widest uppercase py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Pay & Neutralize ${result.offsetCostUsd}
                </button>
              </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
};

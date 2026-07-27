'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { X, Bot, Compass, DollarSign, Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [carbonImportance, setCarbonImportance] = useState('HIGH');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const interestOptions = [
    { name: 'Eco Tours', val: 'Eco' },
    { name: 'Luxury Escape', val: 'Luxury' },
    { name: 'Adventure Safari', val: 'Adventure' },
    { name: 'Honeymoon', val: 'Honeymoon' },
    { name: 'Solo Travel', val: 'Solo' },
  ];

  const handleInterestToggle = (val: string) => {
    if (interests.includes(val)) {
      setInterests(interests.filter((i) => i !== val));
    } else {
      setInterests([...interests, val]);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/recommend', {
        interests,
        budget: budget ? parseFloat(budget) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        carbonImportance,
      });
      setRecommendations(res.data.data.recommendations || []);
    } catch (error) {
      console.error('AI Recommendation retrieval failed:', error);
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
            <Bot className="w-6 h-6 text-gold animate-pulse" />
            <h3 className="font-serif text-2xl text-forest font-semibold">EcoVoyage AI Concierge</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-forest/5 text-forest/70 hover:text-forest transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content container */}
        <div className="flex-1 space-y-6">
          
          {/* Instructions */}
          <div className="bg-forest/5 border border-forest/10 rounded-2xl p-4 flex items-start space-x-3">
            <Bot className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p className="text-xs text-forest/90 leading-relaxed font-sans">
              Welcome, traveler. Provide your preferred duration, maximum budget, and travel interests, and I will parse our zero-carbon catalog to suggest the perfect luxury matches.
            </p>
          </div>

          {/* Interests selection */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold flex items-center">
              <Compass className="w-3.5 h-3.5 mr-1 text-gold" /> Travel Style
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleInterestToggle(opt.val)}
                  className={`py-2 px-4 rounded-full text-xs font-sans tracking-wide border transition-all duration-300 ${
                    interests.includes(opt.val)
                      ? 'bg-forest border-gold text-cream font-medium'
                      : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Budget input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-gold" /> Maximum Budget (USD)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
            />
          </div>

          {/* Duration Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> Target Duration (Days)
            </label>
            <input
              type="number"
              placeholder="e.g. 7"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
            />
          </div>

          {/* Carbon footprint priority */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">
              Sustainability Rating Filter
            </label>
            <div className="flex space-x-3">
              {[
                { type: 'HIGH', label: 'Maximum Neutrality (A+ Rating)' },
                { type: 'NORMAL', label: 'Standard Luxury Balance' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setCarbonImportance(item.type)}
                  className={`flex-1 py-3 px-2 text-center text-xs font-inter tracking-wider rounded-xl border transition-all duration-300 ${
                    carbonImportance === item.type
                      ? 'bg-forest border-gold text-cream'
                      : 'border-forest/10 bg-white hover:bg-forest/5 text-forest'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Search */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>{loading ? 'Consulting Travel Database...' : 'Get AI Recommendation'}</span>
          </button>

          {/* Results section */}
          {searched && !loading && (
            <div className="border-t border-forest/10 pt-6 space-y-4">
              <h4 className="font-serif text-lg text-forest font-bold mb-2">Curated Matches</h4>
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div
                    key={rec.package.id}
                    className="bg-white border border-forest/5 rounded-2xl p-5 shadow-soft hover:border-gold/30 transition-all duration-300 flex flex-col space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-serif text-sm font-semibold text-forest leading-snug pr-4">
                        {rec.package.name}
                      </h5>
                      <span className="bg-gold/10 text-gold font-inter text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shrink-0">
                        {rec.matchScore}% Match
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-charcoal/70 line-clamp-2 leading-relaxed">
                      {rec.package.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-forest/70 font-semibold pt-2 border-t border-forest/5">
                      <span>{rec.package.durationDays} Days</span>
                      <span>${rec.package.price} / Guest</span>
                      <span className="text-emerald-green font-bold">Offset: {rec.package.carbonFootprint}t</span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/packages?search=${encodeURIComponent(rec.package.name)}`);
                      }}
                      className="w-full mt-2 bg-forest/5 hover:bg-forest hover:text-cream text-forest text-[10px] tracking-widest uppercase py-2 rounded-lg font-inter transition-all duration-300 border border-forest/10"
                    >
                      Book Escape
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 text-center flex items-center space-x-3 text-red-900">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs text-left">
                    No matching itineraries fit your budget parameters. Try increasing your maximum budget or modifying interests.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User, Leaf, Bot, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenAiAssistant?: () => void;
  onOpenCarbonCalculator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiAssistant, onOpenCarbonCalculator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Tours', href: '/packages' },
    { name: 'Eco Lodges', href: '/hotels' },
    { name: 'Activities', href: '/activities' },
    { name: 'Stories', href: '/blog' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4 glass shadow-soft'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Leaf className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-serif text-2xl tracking-wider font-semibold text-forest">
            ECOVOYAGE
            <span className="text-gold text-sm ml-1 font-sans font-light tracking-widest">LUXURY</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-inter text-sm tracking-widest uppercase transition-all duration-300 relative py-1 ${
                isActive(link.href)
                  ? 'text-gold font-medium'
                  : 'text-forest/80 hover:text-forest'
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* AI Helper Trigger */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="p-2 rounded-full text-forest hover:text-gold hover:bg-forest/5 transition-all duration-300"
              title="AI Tour Recommendation"
            >
              <Bot className="w-5 h-5 animate-pulse" />
            </button>
          )}

          {/* Carbon Offset Trigger */}
          {onOpenCarbonCalculator && (
            <button
              onClick={onOpenCarbonCalculator}
              className="p-2 rounded-full text-forest hover:text-gold hover:bg-forest/5 transition-all duration-300"
              title="Carbon Footprint Calculator"
            >
              <Leaf className="w-5 h-5" />
            </button>
          )}

          {/* Wishlist Link */}
          {isAuthenticated && (
            <Link
              href="/dashboard?tab=wishlist"
              className="p-2 rounded-full text-forest hover:text-gold hover:bg-forest/5 transition-all duration-300"
              title="Saved Trips"
            >
              <Heart className="w-5 h-5" />
            </Link>
          )}

          {/* Authentication State Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="flex items-center space-x-2 text-sm text-forest font-inter tracking-wider hover:text-gold transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full border border-gold overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50'} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="font-medium hidden xl:inline">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-xs uppercase tracking-widest text-red-700 hover:text-red-950 font-inter cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="font-inter text-xs tracking-widest uppercase text-forest hover:text-gold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-forest hover:bg-emerald-green text-cream font-inter text-xs tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300 shadow-soft hover-gold-glow"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-forest hover:text-gold transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream/98 border-t border-forest/10 shadow-soft flex flex-col p-6 space-y-4 animate-fade-in z-40 glass">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              className={`font-inter text-sm tracking-widest uppercase py-2 border-b border-forest/5 ${
                isActive(link.href) ? 'text-gold' : 'text-forest'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex justify-around items-center pt-4 border-t border-forest/10">
            {onOpenAiAssistant && (
              <button
                onClick={() => { setIsOpen(false); onOpenAiAssistant(); }}
                className="flex items-center space-x-2 text-sm text-forest"
              >
                <Bot className="w-5 h-5" />
                <span>AI Recommendations</span>
              </button>
            )}
            {onOpenCarbonCalculator && (
              <button
                onClick={() => { setIsOpen(false); onOpenCarbonCalculator(); }}
                className="flex items-center space-x-2 text-sm text-forest"
              >
                <Leaf className="w-5 h-5" />
                <span>Carbon Offset</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link
                  href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 py-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gold" />
                  <span className="font-serif text-forest">{user?.name} Dashboard</span>
                </Link>
                <button
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="w-full bg-red-700 text-cream py-3 rounded-full text-center text-xs uppercase tracking-widest"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="w-full border border-forest text-forest py-3 rounded-full text-center text-xs uppercase tracking-widest"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={handleLinkClick}
                  className="w-full bg-forest text-cream py-3 rounded-full text-center text-xs uppercase tracking-widest"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

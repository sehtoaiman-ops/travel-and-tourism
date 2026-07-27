'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { CreditCard, ShieldCheck, QrCode, ArrowRight, Award, AlertCircle } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  
  const bookingId = searchParams.get('bookingId');
  const total = searchParams.get('total');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    if (!bookingId || !token) {
      router.push('/packages');
    }
  }, [bookingId, token, router]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookings/confirm',
        {
          bookingId,
          paymentMethod: 'STRIPE',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.status === 'success') {
        setConfirmedBooking(res.data.data.booking);
        setSuccess(true);
        await refreshUser(); // refresh user dashboard details
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-cream py-32 px-6 md:px-12 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-forest/5 p-8 md:p-12 shadow-luxury">
          
          {!success ? (
            /* Billing Form */
            <div className="space-y-8 animate-fade-in">
              <div className="text-center md:text-left border-b border-forest/5 pb-6">
                <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold mb-2 block">Stripe Gateway Secure Payment</span>
                <h1 className="font-serif text-3xl text-forest font-semibold">Premium Billing Portal</h1>
                <p className="text-xs text-charcoal/60 mt-1 font-light">Confirm transaction to secure your reservation seat.</p>
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-start space-x-2 text-red-900">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs">{error}</span>
                </div>
              )}

              {/* Booking Summary */}
              <div className="bg-cream border border-forest/5 rounded-2xl p-6 flex justify-between items-center text-sm">
                <div>
                  <span className="text-xs uppercase tracking-widest text-forest/50 font-inter font-semibold block">Booking Reference</span>
                  <span className="font-mono text-xs text-charcoal font-bold">{bookingId}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-widest text-forest/50 font-inter font-semibold block">Transaction Total</span>
                  <span className="font-serif text-2xl font-bold text-forest">${total}</span>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cardholder */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sebastian Cole"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                      required
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block flex items-center">
                      <CreditCard className="w-4 h-4 mr-1 text-gold" /> Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                      required
                    />
                  </div>

                  {/* Expiry */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                      required
                    />
                  </div>

                  {/* CVC */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-inter tracking-widest text-forest font-semibold block">Security Code (CVC)</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full bg-forest/5 border border-forest/10 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors font-sans"
                      required
                    />
                  </div>

                </div>

                <div className="flex items-center space-x-2 text-xs text-charcoal/60 bg-forest/5 p-4 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-green shrink-0" />
                  <p>Secured with Stripe TLS encryption. Your billing information is fully tokenized and never logged.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 shadow-soft hover-gold-glow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>{loading ? 'Authorizing Payment...' : `Authorize Billing $${total}`}</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </button>
              </form>
            </div>
          ) : (
            /* Success Receipt */
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-emerald-green/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-emerald-green/30">
                <ShieldCheck className="w-10 h-10 text-emerald-green animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold">Transaction Certified</span>
                <h1 className="font-serif text-3xl text-forest font-semibold">Payment Completed Successfully!</h1>
                <p className="text-xs text-charcoal/60 max-w-md mx-auto leading-relaxed font-light">
                  Your carbon-neutral escape is locked in. Your checked ticket QR code and invoice are available below.
                </p>
              </div>

              {/* The Ticket QR Section */}
              <div className="bg-cream border border-forest/5 rounded-3xl p-8 max-w-sm mx-auto shadow-soft space-y-6">
                <div className="border-b border-forest/10 pb-4 flex justify-between items-center text-xs uppercase tracking-widest text-forest font-bold">
                  <span>Carbon neutral</span>
                  <Award className="w-4 h-4 text-gold" />
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-forest/5 inline-block">
                  <QrCode className="w-40 h-40 text-forest mx-auto" />
                </div>

                <div className="text-left space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-forest/60">Ticket Code:</span>
                    <span className="font-mono font-bold text-[11px] text-charcoal">{confirmedBooking?.qrCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Package:</span>
                    <span className="font-bold text-forest line-clamp-1">{confirmedBooking?.package?.name || 'Eco-Resort Resort'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Date:</span>
                    <span className="font-bold text-forest">{new Date(confirmedBooking?.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/60">Guests:</span>
                    <span className="font-bold text-forest">{confirmedBooking?.guestsCount} Travelers</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-soft cursor-pointer"
                >
                  Go to Traveler Center
                </button>
                <button
                  onClick={() => window.print()}
                  className="border border-forest/20 hover:border-forest text-forest font-semibold font-inter text-xs tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300"
                >
                  Print PDF Invoice
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

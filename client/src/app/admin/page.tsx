'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import axios from 'axios';
import { Shield, Users, Calendar, DollarSign, Leaf, Plus, Trash2, ArrowUpRight, BarChart2, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading } = useAuth();

  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCarbonOffset: 0,
    totalPackages: 0,
    totalHotels: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);

  // Modal / Add package state
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, users, bookings, packages

  // Fetch admin content
  const fetchAdminData = async () => {
    if (!token) return;
    setAdminLoading(true);
    try {
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data.data.stats);
      setChartData(statsRes.data.data.chartData);

      const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data.data.users);

      const bookingsRes = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingsRes.data.data.bookings);

      const packagesRes = await axios.get('http://localhost:5000/api/packages');
      setPackages(packagesRes.data.data.packages);
    } catch (error) {
      console.error('Failed to load administrator panel:', error);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        router.push('/login');
      } else {
        fetchAdminData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated, user, router]);

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    if (!token) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateUserRole = async (userId: string, roleName: string) => {
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/api/admin/users/role', { userId, roleName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-gold border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'text-emerald-green' },
    { title: 'Bookings Logged', value: stats.totalBookings, icon: Calendar, color: 'text-forest' },
    { title: 'Tons CO₂ Offset', value: `${stats.totalCarbonOffset}t`, icon: Leaf, color: 'text-gold' },
    { title: 'Travelers Registered', value: stats.totalUsers, icon: Users, color: 'text-blue-900' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-cream py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-forest/10 pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-gold" />
                <span className="text-[10px] uppercase tracking-widest font-inter text-gold font-bold">Platform Control Room</span>
              </div>
              <h1 className="font-serif text-3xl text-forest font-semibold mt-2">Enterprise Administration</h1>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-forest/5 border border-forest/10 p-1.5 rounded-full space-x-1">
              {[
                { name: 'analytics', label: 'Analytics' },
                { name: 'users', label: 'Users' },
                { name: 'bookings', label: 'Bookings' },
                { name: 'packages', label: 'Packages' },
              ].map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-6 py-2.5 rounded-full text-xs font-inter uppercase tracking-wider font-semibold transition-all duration-300 ${
                    activeTab === tab.name
                      ? 'bg-forest text-cream shadow-soft'
                      : 'text-forest/70 hover:text-forest'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Dashboard */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-white border border-forest/5 rounded-3xl p-6 shadow-soft flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-forest/50 font-semibold font-inter">{kpi.title}</span>
                      <h3 className="font-serif text-2xl font-bold text-forest">{kpi.value}</h3>
                    </div>
                    <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                  </div>
                ))}
              </div>

              {/* Analytics Chart Block */}
              <div className="glass rounded-3xl p-8 shadow-luxury space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg text-forest font-bold flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-gold" />
                    <span>Revenue Velocity (Last Transactions)</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-green font-bold bg-emerald-green/10 px-3 py-1 rounded-full">
                    Stripe Live Feed
                  </span>
                </div>

                {/* SVG Line / Bar chart representation */}
                <div className="h-72 w-full bg-cream/50 rounded-2xl p-6 border border-forest/5 flex items-end justify-around relative">
                  {chartData.length > 0 ? (
                    chartData.map((d, i) => {
                      const maxVal = Math.max(...chartData.map(cd => cd.revenue)) || 1;
                      const pct = (d.revenue / maxVal) * 80 + 10; // offset for height min/max
                      return (
                        <div key={i} className="flex flex-col items-center group w-12">
                          <span className="opacity-0 group-hover:opacity-100 bg-forest text-cream text-[10px] px-2 py-1 rounded-md absolute -translate-y-8 transition-opacity duration-300 font-mono shadow-soft">
                            ${d.revenue}
                          </span>
                          <div
                            style={{ height: `${pct}%` }}
                            className="w-8 bg-forest hover:bg-gold rounded-t-lg transition-all duration-500 shadow-soft"
                          />
                          <span className="text-[10px] text-forest/70 mt-3 font-inter tracking-wider font-semibold">
                            {d.date}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-forest/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-light">No verified transactions yet.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="glass rounded-3xl p-8 shadow-soft space-y-6">
              <h2 className="font-serif text-xl text-forest font-semibold">Travelers Directory</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-forest/10 font-inter text-forest/50 uppercase tracking-widest">
                      <th className="py-4">User</th>
                      <th className="py-4">Email</th>
                      <th className="py-4">Registration</th>
                      <th className="py-4 text-right">Access Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-forest/5 font-sans">
                        <td className="py-4 flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gold" />
                          <span className="font-bold text-forest">{u.name}</span>
                        </td>
                        <td className="py-4 text-charcoal/80">{u.email}</td>
                        <td className="py-4 text-charcoal/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <select
                            value={u.role.name}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className="bg-cream border border-forest/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold font-inter font-semibold"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="GUIDE">GUIDE</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOOKING MANAGEMENT TAB */}
          {activeTab === 'bookings' && (
            <div className="glass rounded-3xl p-8 shadow-soft space-y-6">
              <h2 className="font-serif text-xl text-forest font-semibold">Active Travel Reservations</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-forest/10 font-inter text-forest/50 uppercase tracking-widest">
                      <th className="py-4">Traveler</th>
                      <th className="py-4">Package / Destination</th>
                      <th className="py-4">Payment</th>
                      <th className="py-4">Reservation Status</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-forest/5 font-sans">
                        <td className="py-4 font-bold text-forest">
                          {b.user.name}<br />
                          <span className="text-[10px] text-charcoal/40 font-normal font-mono">{b.user.email}</span>
                        </td>
                        <td className="py-4">
                          <span className="font-bold text-forest leading-snug">{b.package?.name || b.hotel?.name || 'Resort Stay'}</span>
                          <span className="text-[10px] text-charcoal/50 block mt-1">{new Date(b.checkInDate).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 font-serif font-bold text-forest">${b.totalPrice}</td>
                        <td className="py-4">
                          <span className={`text-[9px] font-inter font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-green/10 text-emerald-green border border-emerald-green/20'
                              : 'bg-gold/10 text-gold border border-gold/20'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="bg-cream border border-forest/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold font-inter font-semibold"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PACKAGE CRUD TAB */}
          {activeTab === 'packages' && (
            <div className="glass rounded-3xl p-8 shadow-soft space-y-6">
              <div className="flex justify-between items-center border-b border-forest/5 pb-4">
                <h2 className="font-serif text-xl text-forest font-semibold">Expedition Itineraries</h2>
                <button
                  onClick={() => alert('New Package Form details.\nConnect controller createPackage API.')}
                  className="bg-forest hover:bg-emerald-green text-cream font-semibold font-inter text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-300 shadow-soft hover-gold-glow flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Package</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-forest/10 font-inter text-forest/50 uppercase tracking-widest">
                      <th className="py-4">Itinerary</th>
                      <th className="py-4">Difficulty</th>
                      <th className="py-4">CO₂ Offset</th>
                      <th className="py-4">Rate</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="border-b border-forest/5 font-sans">
                        <td className="py-4 flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pkg.image} alt={pkg.name} className="w-10 h-10 object-cover rounded-lg border border-forest/5" />
                          <div>
                            <span className="font-bold text-forest line-clamp-1">{pkg.name}</span>
                            <span className="text-[10px] text-charcoal/40 block mt-0.5">{pkg.durationDays} Days</span>
                          </div>
                        </td>
                        <td className="py-4 text-charcoal/80 font-semibold">{pkg.difficulty}</td>
                        <td className="py-4 text-emerald-green font-bold font-inter">{pkg.carbonFootprint}t CO₂</td>
                        <td className="py-4 font-serif font-bold text-forest">${pkg.price}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-red-700 hover:text-red-950 p-2 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                            title="Delete Tour"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

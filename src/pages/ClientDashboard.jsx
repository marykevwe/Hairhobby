import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatPrice } from '../utils/helpers';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-brand-50 text-brand-700',
  declined: 'bg-red-50 text-red-700',
  cancelled: 'bg-ink-900/5 text-ink-900/50',
};

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const { fetchMyBookings, updateBookingStatus } = useData();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    setLoading(true);
    try {
      setBookings(await fetchMyBookings());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBookings(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCancel(id) {
    await updateBookingStatus(id, 'cancelled');
    loadBookings();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Hi, {currentUser.name.split(' ')[0]} 👋</h1>
      <p className="text-ink-900/60 mb-8">Track your booking requests and manage your appointments.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5">
          <p className="text-2xl font-display font-semibold text-ink-900">{bookings.length}</p>
          <p className="text-sm text-ink-900/50">Total bookings</p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5">
          <p className="text-2xl font-display font-semibold text-ink-900">{bookings.filter((b) => b.status === 'pending').length}</p>
          <p className="text-sm text-ink-900/50">Awaiting confirmation</p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5">
          <p className="text-2xl font-display font-semibold text-ink-900">{bookings.filter((b) => b.status === 'completed').length}</p>
          <p className="text-sm text-ink-900/50">Completed</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">My bookings</h2>
        <Link to="/explore" className="text-brand-600 font-semibold text-sm">Find a professional →</Link>
      </div>

      {loading ? (
        <p className="text-ink-900/40 text-center py-10">Loading your bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-100/60 p-10 text-center">
          <p className="text-ink-900/60 mb-4">You haven't booked anyone yet.</p>
          <Link to="/explore" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors inline-block">Explore professionals</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">{b.serviceName} <span className="text-ink-900/40 font-normal">with</span> {b.proName}</p>
                <p className="text-sm text-ink-900/50">{b.date} at {b.time} · {formatPrice(b.price, b.currency)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || 'bg-ink-900/5'}`}>{b.status}</span>
                <Link to={`/pro/${b.proId}`} className="text-sm font-semibold text-brand-600">View pro</Link>
                {b.status === 'pending' && (
                  <button onClick={() => handleCancel(b.id)} className="text-sm font-semibold text-ink-900/40 hover:text-red-500">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

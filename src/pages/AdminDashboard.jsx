import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import * as adminApi from '../api/admin';
import { normalizeUser } from '../utils/normalize';
import ReviewStars from '../components/ReviewStars';
import { formatPrice } from '../utils/helpers';

const TABS = ['Overview', 'Professionals', 'Clients', 'Bookings', 'Reviews'];

export default function AdminDashboard() {
  const { pros, fetchPros, updatePro, removeProFromCache, fetchAllBookings, fetchAllReviews, removeReview } = useData();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadEverything() {
    setLoading(true);
    try {
      const [statsData, usersData, , bookingData, reviewData] = await Promise.all([
        adminApi.getStats(),
        adminApi.listUsers('client'),
        fetchPros(),
        fetchAllBookings(),
        fetchAllReviews(),
      ]);
      setStats(statsData);
      setClients(usersData.users.map(normalizeUser));
      setBookings(bookingData);
      setReviews(reviewData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEverything(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleVerify(pro) {
    await updatePro(pro.id, { verified: !pro.verified });
  }

  async function handleRemovePro(pro) {
    if (!confirm(`Remove ${pro.businessName} from the platform?`)) return;
    await adminApi.deletePro(pro.id);
    removeProFromCache(pro.id);
  }

  async function toggleSuspend(user) {
    const { user: updated } = await adminApi.updateUserAdmin(user.id, { suspended: !user.suspended });
    setClients((prev) => prev.map((c) => (c.id === user.id ? normalizeUser(updated) : c)));
  }

  async function handleDeleteUser(user) {
    if (!confirm(`Delete ${user.name}'s account?`)) return;
    await adminApi.deleteUserAdmin(user.id);
    setClients((prev) => prev.filter((c) => c.id !== user.id));
  }

  async function handleRemoveReview(review) {
    await removeReview(review.id, review.proId);
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-ink-900/60">Loading admin data…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Admin control center</h1>
      <p className="text-ink-900/60 mb-8">Manage every professional, client, booking and review on Tressly.</p>

      <div className="flex gap-2 mb-8 border-b border-brand-100 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-ink-900/50 hover:text-ink-900'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['Professionals', stats.proCount],
            ['Clients', stats.clientCount],
            ['Bookings', stats.bookingCount],
            ['Reviews', stats.reviewCount],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5">
              <p className="text-2xl font-display font-semibold text-ink-900">{value}</p>
              <p className="text-sm text-ink-900/50">{label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Professionals' && (
        <div className="space-y-3">
          {pros.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.businessName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-ink-900">{p.businessName}</p>
                  <p className="text-sm text-ink-900/50">{p.category} · {p.city}, {p.country} · <ReviewStars rating={p.rating} size={12} /></p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => toggleVerify(p)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${p.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {p.verified ? 'Verified' : 'Verify now'}
                </button>
                <button onClick={() => handleRemovePro(p)} className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-full">Remove listing</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Clients' && (
        <div className="space-y-3">
          {clients.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">{u.name}</p>
                <p className="text-sm text-ink-900/50">{u.email} · {u.city ? `${u.city}, ${u.country}` : 'No location set'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleSuspend(u)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${u.suspended ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'}`}>
                  {u.suspended ? 'Suspended' : 'Suspend'}
                </button>
                <button onClick={() => handleDeleteUser(u)} className="text-xs font-semibold text-ink-900/40 hover:text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 && <p className="text-ink-900/50 text-sm">No bookings on the platform yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-ink-900">{b.serviceName} — {b.clientName} → {b.proName}</p>
                <p className="text-sm text-ink-900/50">{b.date} at {b.time} · {formatPrice(b.price, b.currency)}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-ink-900/5 text-ink-900/60 capitalize w-fit">{b.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 && <p className="text-ink-900/50 text-sm">No reviews submitted yet.</p>}
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900 text-sm">{r.clientName} <ReviewStars rating={r.rating} showNumber={false} size={13} /></p>
                <p className="text-sm text-ink-900/60">{r.comment}</p>
              </div>
              <button onClick={() => handleRemoveReview(r)} className="text-xs font-semibold text-ink-900/40 hover:text-red-500 whitespace-nowrap">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

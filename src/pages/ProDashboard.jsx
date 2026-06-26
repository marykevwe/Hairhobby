import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatPrice, formatDuration } from '../utils/helpers';

const TABS = ['Overview', 'Services', 'Bookings', 'Profile'];
const CURRENCIES = ['USD', 'GBP', 'NGN', 'CAD', 'GHS', 'ZAR'];

export default function ProDashboard() {
  const { currentUser } = useAuth();
  const { fetchPro, fetchProBookings, updatePro, addService, updateService, removeService, updateBookingStatus } = useData();
  const [tab, setTab] = useState('Overview');
  const [pro, setPro] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', currency: 'USD', duration: '' });
  const [editingId, setEditingId] = useState(null);
  const [profileForm, setProfileForm] = useState({ businessName: '', bio: '', avatar: '', cover: '' });

  async function loadAll() {
    setLoading(true);
    try {
      const [proData, bookingData] = await Promise.all([
        fetchPro(currentUser.proId),
        fetchProBookings(currentUser.proId),
      ]);
      setPro(proData);
      setBookings(bookingData);
      setProfileForm({ businessName: proData.businessName, bio: proData.bio, avatar: proData.avatar, cover: proData.cover });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !pro) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-ink-900/60">Loading your business profile…</div>;
  }

  async function handleServiceSubmit(e) {
    e.preventDefault();
    const payload = { name: serviceForm.name, price: Number(serviceForm.price), currency: serviceForm.currency, duration: Number(serviceForm.duration) };
    const updated = editingId
      ? await updateService(pro.id, editingId, payload)
      : await addService(pro.id, payload);
    setPro(updated);
    setEditingId(null);
    setServiceForm({ name: '', price: '', currency: 'USD', duration: '' });
  }

  function startEdit(s) {
    setEditingId(s.id);
    setServiceForm({ name: s.name, price: s.price, currency: s.currency, duration: s.duration });
  }

  async function handleRemoveService(serviceId) {
    setPro(await removeService(pro.id, serviceId));
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setPro(await updatePro(pro.id, profileForm));
  }

  async function handleBookingStatus(id, status) {
    await updateBookingStatus(id, status);
    setBookings(await fetchProBookings(pro.id));
  }

  const earnings = bookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <img src={pro.avatar} alt={pro.businessName} className="w-16 h-16 rounded-full object-cover border-2 border-brand-100" />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{pro.businessName}</h1>
          <p className="text-ink-900/50 text-sm">{pro.category} · {pro.city}, {pro.country} {pro.verified ? '· ✓ Verified' : '· Pending verification'}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-brand-100 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-ink-900/50 hover:text-ink-900'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5"><p className="text-2xl font-display font-semibold">{bookings.length}</p><p className="text-sm text-ink-900/50">Total bookings</p></div>
          <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5"><p className="text-2xl font-display font-semibold">{bookings.filter((b) => b.status === 'pending').length}</p><p className="text-sm text-ink-900/50">Pending requests</p></div>
          <div className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5"><p className="text-2xl font-display font-semibold text-brand-600">{formatPrice(earnings, pro.services[0]?.currency || 'USD')}</p><p className="text-sm text-ink-900/50">Earnings from completed jobs</p></div>
        </div>
      )}

      {tab === 'Services' && (
        <div>
          <form onSubmit={handleServiceSubmit} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-5 grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
            <input required placeholder="Service name" value={serviceForm.name} onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))} className="sm:col-span-2 px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            <input required type="number" min="0" placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm((f) => ({ ...f, price: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            <select value={serviceForm.currency} onChange={(e) => setServiceForm((f) => ({ ...f, currency: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input required type="number" min="0" placeholder="Mins" value={serviceForm.duration} onChange={(e) => setServiceForm((f) => ({ ...f, duration: e.target.value }))} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            <button type="submit" className="sm:col-span-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors">{editingId ? 'Update service' : '+ Add service'}</button>
          </form>

          <div className="space-y-3">
            {pro.services.length === 0 && <p className="text-ink-900/50 text-sm">No services yet — add your first one above.</p>}
            {pro.services.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-white border border-brand-100 rounded-xl p-4 shadow-soft">
                <div>
                  <p className="font-semibold text-ink-900">{s.name}</p>
                  <p className="text-sm text-ink-900/50">{formatDuration(s.duration)} · {formatPrice(s.price, s.currency)}</p>
                </div>
                <div className="flex gap-3 text-sm font-semibold">
                  <button onClick={() => startEdit(s)} className="text-brand-600">Edit</button>
                  <button onClick={() => handleRemoveService(s.id)} className="text-ink-900/40 hover:text-red-500">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 && <p className="text-ink-900/50 text-sm">No booking requests yet.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">{b.serviceName} <span className="text-ink-900/40 font-normal">for</span> {b.clientName}</p>
                <p className="text-sm text-ink-900/50">{b.date} at {b.time} · {formatPrice(b.price, b.currency)}</p>
                {b.note && <p className="text-sm text-ink-900/40 italic mt-1">"{b.note}"</p>}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {b.status === 'pending' && (
                  <>
                    <button onClick={() => handleBookingStatus(b.id, 'confirmed')} className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">Confirm</button>
                    <button onClick={() => handleBookingStatus(b.id, 'declined')} className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded-full">Decline</button>
                  </>
                )}
                {b.status === 'confirmed' && (
                  <button onClick={() => handleBookingStatus(b.id, 'completed')} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full">Mark completed</button>
                )}
                {!['pending', 'confirmed'].includes(b.status) && (
                  <span className="text-xs font-semibold text-ink-900/40 capitalize">{b.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Profile' && (
        <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-brand-100/60 shadow-soft p-6 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Business name</label>
            <input value={profileForm.businessName} onChange={(e) => setProfileForm((f) => ({ ...f, businessName: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Bio</label>
            <textarea rows={3} value={profileForm.bio} onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Avatar image URL</label>
            <input value={profileForm.avatar} onChange={(e) => setProfileForm((f) => ({ ...f, avatar: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Cover image URL</label>
            <input value={profileForm.cover} onChange={(e) => setProfileForm((f) => ({ ...f, cover: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">Save changes</button>
        </form>
      )}
    </div>
  );
}

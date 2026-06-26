import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../data/locations';
import { CATEGORIES } from '../data/mockData';

export default function SignupPro() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', businessName: '', category: CATEGORIES[0], email: '', password: '', country: '', region: '', city: '' });
  const [error, setError] = useState('');

  const regions = COUNTRIES.find((c) => c.code === form.country)?.regions || [];
  const cities = regions.find((r) => r.name === form.region)?.cities || [];

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value, ...(key === 'country' ? { region: '', city: '' } : {}), ...(key === 'region' ? { city: '' } : {}) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await signup({ ...form, role: 'pro' });
    if (!result.ok) { setError(result.error); return; }
    navigate('/pro-dashboard');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-brand-50/40">
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-lg w-full border border-brand-100/60">
        <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">List your business on Tressly</h1>
        <p className="text-ink-900/60 mb-6 text-sm">Reach clients worldwide and manage your bookings from one dashboard.</p>

        {error && <p className="bg-brand-50 text-brand-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Your name</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Business name</label>
              <input required value={form.businessName} onChange={(e) => update('businessName', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">What do you do?</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Password</label>
            <input required type="password" minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <select required value={form.country} onChange={(e) => update('country', e.target.value)} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              <option value="">Select country</option>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select required value={form.region} onChange={(e) => update('region', e.target.value)} disabled={!form.country} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50">
                <option value="">Region/State</option>
                {regions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
              <select required value={form.city} onChange={(e) => update('city', e.target.value)} disabled={!form.region} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50">
                <option value="">City</option>
                {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-ink-900/40">New listings are reviewed by our admin team before they're verified, but you can start adding services right away.</p>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors">Create business account</button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-900/50">
          Already registered? <Link to="/login" className="text-brand-600 font-semibold">Log in</Link>
        </div>
      </div>
    </div>
  );
}

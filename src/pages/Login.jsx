import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPath = { admin: '/admin', pro: '/pro-dashboard', client: '/dashboard' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) { setError(result.error); return; }
    const redirect = location.state?.from || dashboardPath[result.user.role] || '/';
    navigate(redirect);
  }

  function fillDemo(role) {
    const creds = {
      admin: ['admin@tressly.com', 'admin123'],
      pro: ['pro-1@tressly.com', 'password123'],
      client: ['client@tressly.com', 'client123'],
    };
    setEmail(creds[role][0]);
    setPassword(creds[role][1]);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-brand-50/40">
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full border border-brand-100/60">
        <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Welcome back</h1>
        <p className="text-ink-900/60 mb-6 text-sm">Log in to manage bookings, services or the platform.</p>

        {error && <p className="bg-brand-50 text-brand-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors">Log in</button>
        </form>

        <div className="mt-6 text-center text-sm text-ink-900/50">
          New here? <Link to="/signup-client" className="text-brand-600 font-semibold">Sign up as a client</Link> or <Link to="/signup-pro" className="text-brand-600 font-semibold">list your business</Link>
        </div>

        <div className="mt-6 pt-5 border-t border-brand-100">
          <p className="text-xs font-semibold text-ink-900/40 uppercase tracking-wide mb-2">Try a demo account</p>
          <div className="flex gap-2">
            <button onClick={() => fillDemo('client')} className="flex-1 text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg">Client</button>
            <button onClick={() => fillDemo('pro')} className="flex-1 text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg">Professional</button>
            <button onClick={() => fillDemo('admin')} className="flex-1 text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg">Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/helpers';

const dashboardPath = {
  admin: '/admin',
  pro: '/pro-dashboard',
  client: '/dashboard',
};

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${isActive ? 'text-brand-600' : 'text-ink-900/70 hover:text-brand-600'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-display text-lg">H</span>
          <span className="font-display text-xl font-semibold text-ink-900">Hairbobby</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
          <NavLink to="/signup-pro" className={navLinkClass}>Become a Pro</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!currentUser && (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink-900/80 hover:text-brand-600 px-3 py-2">Log in</Link>
              <Link to="/signup-client" className="text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full shadow-soft transition-colors">Sign up</Link>
            </>
          )}
          {currentUser && (
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-brand-100 hover:bg-brand-50 transition-colors">
                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">{initials(currentUser.name)}</span>
                <span className="text-sm font-semibold text-ink-900/80">{currentUser.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft border border-brand-100 py-2 animate-fade-up">
                  <Link to={dashboardPath[currentUser.role]} onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-ink-900/80 hover:bg-brand-50">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">Log out</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#1c1320" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-100 bg-white px-4 py-4 space-y-3 animate-fade-up">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}><div className="py-2">Home</div></NavLink>
          <NavLink to="/explore" onClick={() => setOpen(false)} className={navLinkClass}><div className="py-2">Explore</div></NavLink>
          <NavLink to="/signup-pro" onClick={() => setOpen(false)} className={navLinkClass}><div className="py-2">Become a Pro</div></NavLink>
          <hr className="border-brand-100" />
          {!currentUser ? (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-center py-2 rounded-full border border-brand-200">Log in</Link>
              <Link to="/signup-client" onClick={() => setOpen(false)} className="text-sm font-semibold text-center py-2 rounded-full bg-brand-600 text-white">Sign up</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to={dashboardPath[currentUser.role]} onClick={() => setOpen(false)} className="text-sm font-semibold text-center py-2 rounded-full border border-brand-200">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm font-semibold text-center py-2 rounded-full bg-brand-50 text-brand-700">Log out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

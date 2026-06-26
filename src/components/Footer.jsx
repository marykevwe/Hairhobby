import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-display text-lg">T</span>
            <span className="font-display text-xl font-semibold text-white">Tressly</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">The worldwide booking marketplace for stylists, barbers, wig sellers and wig ventilators.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">For Clients</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-brand-300">Find a professional</Link></li>
            <li><Link to="/signup-client" className="hover:text-brand-300">Create an account</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-300">My bookings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">For Professionals</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/signup-pro" className="hover:text-brand-300">List your business</Link></li>
            <li><Link to="/login" className="hover:text-brand-300">Pro login</Link></li>
            <li><Link to="/pro-dashboard" className="hover:text-brand-300">Manage services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-brand-300 cursor-default">About Tressly</span></li>
            <li><span className="hover:text-brand-300 cursor-default">Trust &amp; Safety</span></li>
            <li><span className="hover:text-brand-300 cursor-default">Contact</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} Tressly. Available worldwide — UK, US, Nigeria, Canada, Ghana, South Africa & more.</div>
    </footer>
  );
}

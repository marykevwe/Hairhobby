import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-6xl font-semibold text-brand-200 mb-2">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-3">This page took a wrong turn</h1>
      <p className="text-ink-900/60 mb-6 max-w-sm">The page you're looking for doesn't exist, but plenty of great stylists do.</p>
      <Link to="/" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors">Back home</Link>
    </div>
  );
}

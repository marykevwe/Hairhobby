import React from 'react';
import { Link } from 'react-router-dom';

export default function StyleCard({ style }) {
  return (
    <Link
      to={`/explore?style=${style.id}&category=${encodeURIComponent(style.category)}`}
      className="group relative flex-shrink-0 w-44 sm:w-52 h-60 sm:h-64 rounded-2xl overflow-hidden shadow-soft snap-start"
    >
      <img src={style.img} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-white/70 text-xs uppercase tracking-wide font-semibold mb-1">{style.category}</p>
        <p className="text-white font-display text-lg font-semibold leading-tight">{style.name}</p>
      </div>
    </Link>
  );
}

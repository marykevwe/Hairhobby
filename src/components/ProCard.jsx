import React from 'react';
import { Link } from 'react-router-dom';
import ReviewStars from './ReviewStars';

export default function ProCard({ pro, distance }) {
  return (
    <Link to={`/pro/${pro.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-brand-100/60 hover:-translate-y-1 transition-transform duration-300">
      <div className="h-36 overflow-hidden">
        <img src={pro.cover} alt={pro.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3 -mt-10 mb-2">
          <img src={pro.avatar} alt={pro.businessName} className="w-14 h-14 rounded-full border-4 border-white object-cover shadow-soft" />
          {pro.verified && (
            <span className="mt-9 -ml-4 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-lg text-ink-900 leading-tight">{pro.businessName}</h3>
        <p className="text-sm text-ink-900/60 mb-1">{pro.category} · {pro.city}, {pro.country}</p>
        <div className="flex items-center justify-between mt-2">
          <ReviewStars rating={pro.rating} />
          {Number.isFinite(distance) && distance !== Infinity && (
            <span className="text-xs text-brand-600 font-semibold">{distance.toFixed(0)} km away</span>
          )}
        </div>
      </div>
    </Link>
  );
}

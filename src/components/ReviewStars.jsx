import React from 'react';

export default function ReviewStars({ rating = 0, size = 16, showNumber = true }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex" style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= full ? 'text-brand-500' : 'text-brand-100'}>★</span>
        ))}
      </span>
      {showNumber && rating > 0 && (
        <span className="text-sm text-ink-900/60 font-medium">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}

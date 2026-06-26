import React from 'react';
import { mapsEmbedUrl } from '../utils/helpers';

// Lightweight, key-free map: embeds Google Maps' public "q=" search view.
// Good enough to visually orient a client toward a pro's city/area.
export default function MapView({ label, city, region, country, height = 260, className = '' }) {
  const query = [label, city, region, country].filter(Boolean).join(', ');
  return (
    <div className={`overflow-hidden rounded-2xl border border-brand-100 shadow-soft ${className}`}>
      <iframe
        title={`Map of ${query}`}
        src={mapsEmbedUrl(query)}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

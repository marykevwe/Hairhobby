import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProCard from '../components/ProCard';
import MapView from '../components/MapView';
import { useData } from '../context/DataContext';
import { COUNTRIES, findCity } from '../data/locations';
import { CATEGORIES } from '../data/mockData';

export default function SearchResults() {
  const { pros, prosLoading, fetchPros } = useData();
  const [params, setParams] = useSearchParams();

  const category = params.get('category') || '';
  const country = params.get('country') || '';
  const city = params.get('city') || '';
  const styleId = params.get('style') || '';

  const [myCountry, setMyCountry] = useState('');
  const [myCity, setMyCity] = useState('');

  const myRegionName = COUNTRIES.find((c) => c.code === myCountry)?.regions.find((r) => r.cities.some((c) => c.name === myCity))?.name;
  const myCityData = myCity ? findCity(myCountry, myRegionName, myCity) : null;

  useEffect(() => {
    fetchPros({
      category, country, city,
      lat: myCityData?.lat, lng: myCityData?.lng,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, country, city, myCityData?.lat, myCityData?.lng]);

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key === 'country') next.delete('city');
    setParams(next);
  }

  const citiesForCountry = COUNTRIES.find((c) => c.code === country)?.regions.flatMap((r) => r.cities) || [];
  const citiesForMyCountry = COUNTRIES.find((c) => c.code === myCountry)?.regions.flatMap((r) => r.cities) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">
          {styleId ? 'Pros for this look' : 'Explore professionals'}
        </h1>
        <p className="text-ink-900/60">{pros.length} {pros.length === 1 ? 'professional' : 'professionals'} found{city ? ` in ${city}` : country ? ` in ${COUNTRIES.find((c) => c.code === country)?.name}` : ' worldwide'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white rounded-2xl shadow-soft border border-brand-100/60 p-4">
        <select value={category} onChange={(e) => setFilter('category', e.target.value)} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
          <option value="">Any service</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={country} onChange={(e) => setFilter('country', e.target.value)} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
          <option value="">Any country</option>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
        <select value={city} onChange={(e) => setFilter('city', e.target.value)} disabled={!country} className="px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50">
          <option value="">Any city</option>
          {citiesForCountry.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <select value={myCountry} onChange={(e) => { setMyCountry(e.target.value); setMyCity(''); }} className="flex-1 px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">My country</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <select value={myCity} onChange={(e) => setMyCity(e.target.value)} disabled={!myCountry} className="flex-1 px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50">
            <option value="">My city</option>
            {citiesForMyCountry.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {prosLoading && (
            <div className="col-span-full text-center py-16 text-ink-900/40">Loading professionals…</div>
          )}
          {!prosLoading && pros.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-brand-100/60">
              <p className="text-ink-900/60">No professionals match these filters yet. Try widening your search.</p>
            </div>
          )}
          {pros.map((pro) => (
            <ProCard key={pro.id} pro={pro} distance={pro.distanceKm} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <p className="text-sm font-semibold text-ink-900/70 mb-2">{myCity || city || 'Worldwide'} map view</p>
            <MapView city={myCity || city} region="" country={myCity ? COUNTRIES.find((c) => c.code === myCountry)?.name : country ? COUNTRIES.find((c) => c.code === country)?.name : 'World'} height={420} />
            <p className="text-xs text-ink-900/40 mt-2">Set "my city" to sort results by distance and centre the map on your area.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

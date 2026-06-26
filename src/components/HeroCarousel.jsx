import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/locations';
import { CATEGORIES } from '../data/mockData';

const SLIDES = [
  { img: '/images/images/braids4.jpg', eyebrow: 'Protective styling', title: 'Knotless braids that travel with you' },
  { img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1600&auto=format&fit=crop', eyebrow: 'Barbering', title: 'Fades sharp enough to cast a shadow' },
  { img: '/images/studio.jpg', eyebrow: 'Wig artistry', title: 'HD lace, hand-ventilated to the skin' },
  { img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop', eyebrow: 'Makeup', title: 'Bridal glam that lasts past midnight' },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const timer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer.current);
  }, [paused]);

  const cities = COUNTRIES.find((c) => c.code === country)?.regions.flatMap((r) => r.cities) || [];

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (country) params.set('country', country);
    if (city) params.set('city', city);
    navigate(`/explore?${params.toString()}`);
  }

  return (
    <section
      className="relative h-[640px] sm:h-[600px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className={`w-full h-full  ${i === index ? 'scale-110' : 'scale-100'} transition-transform duration-[6000ms] ease-out`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-ink-900/40" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <p className="text-brand-300 font-semibold tracking-wide text-sm uppercase mb-3 animate-fade-up">{SLIDES[index].eyebrow}</p>
        <h1 className="font-display text-white text-4xl sm:text-5xl lg:text-6xl font-semibold max-w-2xl leading-tight mb-4 animate-fade-up">
          {SLIDES[index].title}
        </h1>
        <p className="text-white/80 max-w-lg mb-8 animate-fade-up">
          Book verified stylists, barbers, wig sellers and wig ventilators near you — from Benin City to Brooklyn, Peckham to Pretoria.
        </p>

        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur rounded-2xl shadow-soft p-3 sm:p-4 flex flex-col sm:flex-row gap-2 max-w-3xl w-full">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-brand-100 text-sm font-medium text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">Any service</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={country} onChange={(e) => { setCountry(e.target.value); setCity(''); }} className="flex-1 px-3 py-2.5 rounded-xl border border-brand-100 text-sm font-medium text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300">
            <option value="">Any country</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!country} className="flex-1 px-3 py-2.5 rounded-xl border border-brand-100 text-sm font-medium text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50">
            <option value="">Any city</option>
            {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            Search
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-brand-400' : 'w-3 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}

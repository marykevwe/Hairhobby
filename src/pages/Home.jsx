import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import StyleCard from '../components/StyleCard';
import ProCard from '../components/ProCard';
import { STYLES, CATEGORIES } from '../data/mockData';
import { useData } from '../context/DataContext';

const HOW_IT_WORKS = [
  { title: 'Tell us what you want', text: 'Search by style, service category, or pick your country and city.' },
  { title: 'Compare real pros', text: 'Browse verified profiles, prices, reviews and live map locations.' },
  { title: 'Book in minutes', text: 'Send a request, get confirmed, and show up looking your best.' },
];

export default function Home() {
  const { pros, fetchPros } = useData();

  useEffect(() => {
    fetchPros();
  }, [fetchPros]);

  const featured = [...pros].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div>
      <HeroCarousel />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wide mb-1">Browse by look</p>
            <h2 className="font-display text-3xl font-semibold text-ink-900">Pick a style, meet your pro</h2>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {STYLES.map((style) => <StyleCard key={style.id} style={style} />)}
        </div>
      </section>

      <section className="bg-brand-50/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wide mb-1 text-center">Service categories</p>
          <h2 className="font-display text-3xl font-semibold text-ink-900 text-center mb-10">Every kind of hair pro, in one place</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/explore?category=${encodeURIComponent(cat)}`} className="bg-white rounded-2xl shadow-soft p-5 text-center hover:-translate-y-1 transition-transform border border-brand-100/60">
                <p className="font-display font-semibold text-ink-900 text-sm leading-tight">{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wide mb-1">Top rated</p>
            <h2 className="font-display text-3xl font-semibold text-ink-900">Loved by clients worldwide</h2>
          </div>
          <Link to="/explore" className="text-brand-600 font-semibold text-sm hover:text-brand-700 whitespace-nowrap">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((pro) => <ProCard key={pro.id} pro={pro} />)}
        </div>
      </section>

      <section className="bg-ink-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-300 font-semibold text-sm uppercase tracking-wide mb-1 text-center">How Tressly works</p>
          <h2 className="font-display text-3xl font-semibold text-white text-center mb-10">From search to seat, in three steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-300 font-display font-semibold text-lg flex items-center justify-center mx-auto mb-4">{i + 1}</div>
                <h3 className="text-white font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-10 sm:p-14 text-center shadow-soft">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">Run your business on Tressly</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8">List your services, set your own prices, manage bookings and grow your client base — wherever in the world you work from.</p>
          <Link to="/signup-pro" className="inline-block bg-white text-brand-700 font-semibold px-8 py-3 rounded-full hover:bg-brand-50 transition-colors">
            Register your business
          </Link>
        </div>
      </section>
    </div>
  );
}

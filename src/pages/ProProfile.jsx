import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ReviewStars from '../components/ReviewStars';
import MapView from '../components/MapView';
import BookingModal from '../components/BookingModal';
import { formatPrice, formatDuration } from '../utils/helpers';

export default function ProProfile() {
  const { id } = useParams();
  const { fetchPro, fetchProReviews, addReview } = useData();
  const { currentUser } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [pro, setPro] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchPro(id), fetchProReviews(id)])
      .then(([proData, reviewData]) => {
        if (!active) return;
        setPro(proData);
        setReviews(reviewData);
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, fetchPro, fetchProReviews]);

  async function handleReview(e) {
    e.preventDefault();
    if (!currentUser) return;
    await addReview({ proId: id, rating: reviewRating, comment: reviewText });
    const freshReviews = await fetchProReviews(id);
    setReviews(freshReviews);
    const freshPro = await fetchPro(id);
    setPro(freshPro);
    setReviewText('');
    setReviewRating(5);
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-ink-900/50">Loading profile…</div>;
  }

  if (notFound || !pro) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-900/60 mb-2">This professional could not be found.</p>
        <Link to="/explore" className="text-brand-600 font-semibold">← Back to explore</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="h-56 sm:h-72 w-full overflow-hidden">
        <img src={pro.cover} alt={pro.businessName} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-8">
          <img src={pro.avatar} alt={pro.businessName} className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-soft" />
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">{pro.businessName}</h1>
              {pro.verified && <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Verified</span>}
            </div>
            <p className="text-ink-900/60">{pro.category} · {pro.city}, {pro.region}, {pro.country}</p>
            <div className="mt-1"><ReviewStars rating={pro.rating} /> <span className="text-ink-900/50 text-sm">({reviews.length} reviews)</span></div>
          </div>
          <button onClick={() => setBookingOpen(true)} disabled={pro.services.length === 0} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap">
            Book appointment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold mb-3">About</h2>
              <p className="text-ink-900/70 leading-relaxed">{pro.bio}</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Services & pricing</h2>
              {pro.services.length === 0 ? (
                <p className="text-ink-900/50 text-sm">This professional hasn't listed any services yet.</p>
              ) : (
                <div className="space-y-3">
                  {pro.services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-white border border-brand-100 rounded-xl p-4 shadow-soft">
                      <div>
                        <p className="font-semibold text-ink-900">{s.name}</p>
                        <p className="text-sm text-ink-900/50">{formatDuration(s.duration)}</p>
                      </div>
                      <p className="font-display font-semibold text-brand-600">{formatPrice(s.price, s.currency)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold mb-3">Reviews</h2>
              {currentUser?.role === 'client' && (
                <form onSubmit={handleReview} className="bg-brand-50/60 rounded-xl p-4 mb-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Your rating:</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button type="button" key={n} onClick={() => setReviewRating(n)} className={`text-xl ${n <= reviewRating ? 'text-brand-500' : 'text-brand-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea required value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={2} placeholder="Share your experience..." className="w-full px-3 py-2 rounded-lg border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                  <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Post review</button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-ink-900/50 text-sm">No reviews yet — be the first to book and review.</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-brand-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-ink-900">{r.clientName}</p>
                      <p className="text-xs text-ink-900/40">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ReviewStars rating={r.rating} showNumber={false} size={14} />
                    <p className="text-sm text-ink-900/70 mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-900/70 mb-2">Location</p>
            <MapView label={pro.businessName} city={pro.city} region={pro.region} country={pro.country} height={300} />
            <p className="text-xs text-ink-900/40 mt-2">Exact address shared after booking confirmation.</p>
          </div>
        </div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} pro={pro} />
    </div>
  );
}

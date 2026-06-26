import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatPrice, formatDuration } from '../utils/helpers';

export default function BookingModal({ open, onClose, pro }) {
  const { currentUser } = useAuth();
  const { createBooking } = useData();
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState(pro.services[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const service = pro.services.find((s) => s.id === serviceId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      onClose();
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createBooking({ proId: pro.id, serviceId, date, time, note });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setDone(false);
    setError('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={done ? 'Booking sent' : `Book ${pro.businessName}`}>
      {done ? (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
          <p className="text-ink-900/70 mb-6">Your request has been sent to {pro.businessName}. They'll confirm your appointment shortly — you can track its status from your dashboard.</p>
          <button onClick={() => { handleClose(); navigate('/dashboard'); }} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            Go to my bookings
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="bg-brand-50 text-brand-700 text-sm rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Service</label>
            <select required value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
              {pro.services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {formatPrice(s.price, s.currency)} ({formatDuration(s.duration)})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Date</label>
              <input required type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Time</label>
              <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-900/80 mb-1.5">Note for the professional (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Hair length, reference photos, allergies..." className="w-full px-3 py-2.5 rounded-xl border border-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          {!currentUser && <p className="text-xs text-brand-600">You'll need to log in to confirm this booking.</p>}
          <button type="submit" disabled={submitting} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors">
            {currentUser ? (submitting ? 'Sending…' : 'Send booking request') : 'Log in to book'}
          </button>
        </form>
      )}
    </Modal>
  );
}

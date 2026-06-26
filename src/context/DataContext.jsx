import React, { createContext, useCallback, useContext, useState } from 'react';
import * as prosApi from '../api/pros';
import * as bookingsApi from '../api/bookings';
import * as reviewsApi from '../api/reviews';
import { normalizePro, normalizeBooking, normalizeReview } from '../utils/normalize';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [pros, setPros] = useState([]);
  const [prosLoading, setProsLoading] = useState(false);

  const fetchPros = useCallback(async (filters = {}) => {
    setProsLoading(true);
    try {
      const { pros: list } = await prosApi.getPros(filters);
      const normalized = list.map(normalizePro);
      setPros(normalized);
      return normalized;
    } finally {
      setProsLoading(false);
    }
  }, []);

  const fetchPro = useCallback(async (id) => {
    const { pro } = await prosApi.getPro(id);
    const normalized = normalizePro(pro);
    setPros((prev) => {
      const exists = prev.some((p) => p.id === normalized.id);
      return exists ? prev.map((p) => (p.id === normalized.id ? normalized : p)) : [...prev, normalized];
    });
    return normalized;
  }, []);

  function upsertPro(updated) {
    const normalized = normalizePro(updated);
    setPros((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
    return normalized;
  }

  async function updatePro(proId, patch) {
    const { pro } = await prosApi.updatePro(proId, patch);
    return upsertPro(pro);
  }

  async function addService(proId, service) {
    const { pro } = await prosApi.addService(proId, service);
    return upsertPro(pro);
  }

  async function updateService(proId, serviceId, patch) {
    const { pro } = await prosApi.updateService(proId, serviceId, patch);
    return upsertPro(pro);
  }

  async function removeService(proId, serviceId) {
    const { pro } = await prosApi.deleteService(proId, serviceId);
    return upsertPro(pro);
  }

  function removeProFromCache(proId) {
    setPros((prev) => prev.filter((p) => p.id !== proId));
  }

  // Bookings — fetched on demand by the page that needs them (client/pro/admin dashboards)
  async function createBooking(payload) {
    const { booking } = await bookingsApi.createBooking(payload);
    return normalizeBooking(booking);
  }

  async function fetchMyBookings() {
    const { bookings } = await bookingsApi.getMyBookings();
    return bookings.map(normalizeBooking);
  }

  async function fetchProBookings(proId) {
    const { bookings } = await bookingsApi.getProBookings(proId);
    return bookings.map(normalizeBooking);
  }

  async function fetchAllBookings() {
    const { bookings } = await bookingsApi.getAllBookings();
    return bookings.map(normalizeBooking);
  }

  async function updateBookingStatus(id, status) {
    const { booking } = await bookingsApi.updateBookingStatus(id, status);
    return normalizeBooking(booking);
  }

  // Reviews — fetched per-pro on the profile page, or all at once for admin
  async function fetchProReviews(proId) {
    const { reviews } = await reviewsApi.getProReviews(proId);
    return reviews.map(normalizeReview);
  }

  async function fetchAllReviews() {
    const { reviews } = await reviewsApi.getAllReviews();
    return reviews.map(normalizeReview);
  }

  async function addReview(payload) {
    const { review } = await reviewsApi.createReview(payload);
    // Refresh the pro so its average rating reflects the new review
    fetchPro(payload.proId).catch(() => {});
    return normalizeReview(review);
  }

  async function removeReview(id, proId) {
    await reviewsApi.deleteReview(id);
    if (proId) fetchPro(proId).catch(() => {});
  }

  return (
    <DataContext.Provider value={{
      pros, prosLoading, fetchPros, fetchPro, updatePro, removeProFromCache,
      addService, updateService, removeService,
      createBooking, fetchMyBookings, fetchProBookings, fetchAllBookings, updateBookingStatus,
      fetchProReviews, fetchAllReviews, addReview, removeReview,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

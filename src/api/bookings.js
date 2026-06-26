import { apiFetch } from './client';

export const createBooking = (payload) => apiFetch('/bookings', { method: 'POST', body: payload });
export const getMyBookings = () => apiFetch('/bookings/mine');
export const getProBookings = (proId) => apiFetch(`/bookings/pro/${proId}`);
export const getAllBookings = () => apiFetch('/bookings/all');
export const updateBookingStatus = (id, status) => apiFetch(`/bookings/${id}/status`, { method: 'PATCH', body: { status } });

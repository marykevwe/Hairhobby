import { apiFetch } from './client';

export const getProReviews = (proId) => apiFetch(`/reviews/pro/${proId}`);
export const getAllReviews = () => apiFetch('/reviews/all');
export const createReview = (payload) => apiFetch('/reviews', { method: 'POST', body: payload });
export const deleteReview = (id) => apiFetch(`/reviews/${id}`, { method: 'DELETE' });

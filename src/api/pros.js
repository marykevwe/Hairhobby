import { apiFetch } from './client';

export const getPros = (params = {}) => {
  const query = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString();
  return apiFetch(`/pros${query ? `?${query}` : ''}`);
};
export const getPro = (id) => apiFetch(`/pros/${id}`);
export const updatePro = (id, patch) => apiFetch(`/pros/${id}`, { method: 'PATCH', body: patch });
export const addService = (proId, service) => apiFetch(`/pros/${proId}/services`, { method: 'POST', body: service });
export const updateService = (proId, serviceId, patch) => apiFetch(`/pros/${proId}/services/${serviceId}`, { method: 'PATCH', body: patch });
export const deleteService = (proId, serviceId) => apiFetch(`/pros/${proId}/services/${serviceId}`, { method: 'DELETE' });

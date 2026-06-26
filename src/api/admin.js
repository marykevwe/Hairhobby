import { apiFetch } from './client';

export const getStats = () => apiFetch('/admin/stats');
export const listUsers = (role) => apiFetch(`/admin/users${role ? `?role=${role}` : ''}`);
export const updateUserAdmin = (id, patch) => apiFetch(`/admin/users/${id}`, { method: 'PATCH', body: patch });
export const deleteUserAdmin = (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
export const verifyPro = (id, verified) => apiFetch(`/admin/pros/${id}/verify`, { method: 'PATCH', body: { verified } });
export const deletePro = (id) => apiFetch(`/admin/pros/${id}`, { method: 'DELETE' });

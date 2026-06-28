import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const adminLogin = (data) => api.post('/api/auth/login', data);

// ── Fines ─────────────────────────────────────────────
export const getAllFines        = ()         => api.get('/api/fines');
export const getFineById        = (id)       => api.get(`/api/fines/${id}`);
export const getFinesByUser     = (uid)      => api.get(`/api/fines/user/${uid}`);
export const getFinesByVehicle  = (plate)    => api.get(`/api/fines/vehicle/${plate}`);
export const issueFine          = (data)     => api.post('/api/fines', data);
export const updateFine         = (id, data) => api.put(`/api/fines/${id}`, data);
export const deleteFine         = (id)       => api.delete(`/api/fines/${id}`);
export const markFineAsPaid     = (id)       => api.put(`/api/fines/${id}/pay`);

// ── Users ─────────────────────────────────────────────
export const getAllUsers  = ()       => api.get('/api/users');
export const getUserById = (id)     => api.get(`/api/users/${id}`);
export const updateUser  = (id, d)  => api.put(`/api/users/${id}`, d);
export const deleteUser  = (id)     => api.delete(`/api/users/${id}`);

// ── Officers ───────────────────────────────────────────
export const getOfficers    = ()       => api.get('/api/admin/officers');
export const createOfficer  = (data)   => api.post('/api/admin/officers', data);
export const deleteOfficer  = (id)     => api.delete(`/api/admin/officers/${id}`);

// ── Admin Stats ───────────────────────────────────────
export const getStatsSummary    = () => api.get('/api/admin/stats/summary');
export const getStatsByDistrict = () => api.get('/api/admin/stats/by-district');
export const getStatsByCategory = () => api.get('/api/admin/stats/by-category');

export default api;

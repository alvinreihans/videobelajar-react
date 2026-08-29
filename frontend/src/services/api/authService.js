import axiosClient from './axiosClient';

// Endpoint autentikasi backend (Express) di /api/auth.
// axiosClient sudah mengembalikan response.data langsung.

// POST /auth/register → { success, message, data, emailPreviewUrl? }
export const register = (payload) => axiosClient.post('/auth/register', payload);

// POST /auth/login → { success, message, token, data }
export const login = (payload) => axiosClient.post('/auth/login', payload);

// GET /auth/verify-email?token=... → { success, message }
export const verifyEmail = (token) =>
  axiosClient.get('/auth/verify-email', { params: { token } });

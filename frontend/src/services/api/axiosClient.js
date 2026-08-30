import axios from 'axios';

// Base URL diambil dari .env (VITE_API_BASE_URL) supaya tidak hardcode.
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Menyisipkan token JWT (bila ada) ke header Authorization + logging request.
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// Kembalikan langsung response.data + penanganan error terpusat.
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan pada server';
    if (import.meta.env.DEV) {
      console.error('[API ERROR]', message);
    }
    // Kode status ikut dibawa agar pemanggil bisa membedakan jenis kegagalan
    // (mis. 401 token kedaluwarsa) tanpa perlu menebak dari teks pesan.
    const apiError = new Error(message);
    apiError.status = error.response?.status ?? null;
    return Promise.reject(apiError);
  }
);

export default axiosClient;

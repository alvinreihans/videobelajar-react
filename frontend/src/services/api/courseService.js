import axiosClient from './axiosClient';
import { toCard, toApi, toTutorPayload } from './courseMapper';

// Dua jalur endpoint untuk resource yang sama:
//   PUBLIC    → baca-saja, tanpa token (katalog untuk pengunjung)
//   PROTECTED → butuh JWT (dijaga verifyToken di backend), untuk Kelola Kelas
const PUBLIC = '/public/courses';
const PROTECTED = '/courses';

// Backend membungkus semua response dalam { success, count, data }.
const unwrap = (res) => res?.data ?? res;

// ─── READ ────────────────────────────────────────────────────────────────────

const fetchList = async (base, params) => {
  const rows = unwrap(await axiosClient.get(base, { params }));
  return (Array.isArray(rows) ? rows : []).map(toCard);
};

// GET — daftar kelas untuk katalog.
//
// Pemilihan jalur mengikuti status login:
//   belum login → /public/courses  (tanpa token)
//   sudah login → /courses         (melewati middleware verifyToken)
//
// Token yang sudah kedaluwarsa tidak boleh ikut mematikan katalog: bila jalur
// terproteksi menolak dengan 401, permintaan diulang lewat jalur publik supaya
// halaman tetap tampil, bukan berubah jadi pesan error.
//
// `params` diteruskan apa adanya sebagai query string — dipakai halaman Semua
// Kelas untuk filter (topic), pencarian (search), dan pengurutan (sortBy/order).
// Axios membuang kunci bernilai undefined, jadi param kosong tidak ikut terkirim.
export const getCourses = async (params = {}) => {
  if (!localStorage.getItem('token')) return fetchList(PUBLIC, params);
  try {
    return await fetchList(PROTECTED, params);
  } catch (err) {
    if (err.status !== 401) throw err;
    console.warn('[courses] Token ditolak, beralih ke endpoint publik.');
    return fetchList(PUBLIC, params);
  }
};

// GET by id — detail satu kelas. Selalu lewat jalur publik karena halaman
// Detail Produk bisa dibuka siapa saja.
export const getCourseById = async (id) =>
  toCard(unwrap(await axiosClient.get(`${PUBLIC}/${id}`)));

// ─── REFERENSI KATEGORI ──────────────────────────────────────────────────────
// Form mengirim slug kategori ("desain"), tapi tabel courses menyimpan
// category_id. Daftar kategori diambil sekali lalu dipakai ulang (cache).
let categoriesPromise = null;

const getCategories = () => {
  if (!categoriesPromise) {
    categoriesPromise = axiosClient
      .get('/public/categories')
      .then((res) => unwrap(res) || [])
      .catch((err) => {
        categoriesPromise = null; // biar bisa dicoba lagi saat gagal
        throw err;
      });
  }
  return categoriesPromise;
};

const resolveCategoryId = async (slug) => {
  const categories = await getCategories();
  const found = categories.find((c) => c.slug === slug);
  if (!found) throw new Error(`Kategori '${slug}' tidak dikenal`);
  return found.id;
};

// ─── WRITE (terproteksi) ─────────────────────────────────────────────────────
// Satu form di UI menyentuh dua tabel: `tutors` (profil pengajar) dan
// `courses`. Helper ini menyimpan profil tutor lebih dulu, lalu mengembalikan
// payload course yang sudah lengkap dengan category_id & tutor_id.
const buildCoursePayload = async (data, existingTutorId = null) => {
  const tutor = existingTutorId
    ? unwrap(await axiosClient.put(`/tutors/${existingTutorId}`, toTutorPayload(data)))
    : unwrap(await axiosClient.post('/tutors', toTutorPayload(data)));

  return {
    ...toApi(data),
    category_id: await resolveCategoryId(data.category),
    tutor_id: tutor.id,
  };
};

// ADD — tambah kelas baru (id di-generate oleh server).
export const createCourse = async (data) => {
  const payload = await buildCoursePayload(data);
  return toCard(unwrap(await axiosClient.post(PROTECTED, payload)));
};

// UPDATE — ubah kelas berdasarkan id.
export const updateCourse = async (id, data) => {
  const payload = await buildCoursePayload(data, data.tutorId);
  return toCard(unwrap(await axiosClient.put(`${PROTECTED}/${id}`, payload)));
};

// DELETE — hapus kelas berdasarkan id.
export const deleteCourse = (id) => axiosClient.delete(`${PROTECTED}/${id}`);

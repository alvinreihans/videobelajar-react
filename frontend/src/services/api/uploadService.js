import axiosClient from './axiosClient';

// Batasan ini disamakan dengan yang dijaga multer di backend
// (src/middlewares/upload.middleware.js), supaya pengguna dapat peringatan
// seketika tanpa harus menunggu berkas besar selesai terkirim dulu.
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Periksa berkas sebelum dikirim. Mengembalikan pesan kesalahan, atau null bila lolos.
export function validateImage(file) {
  if (!file) return 'Tidak ada berkas yang dipilih.';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format tidak didukung. Pakai JPG, PNG, WEBP, atau GIF.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `Ukuran berkas ${mb} MB melebihi batas 2 MB.`;
  }
  return null;
}

// POST /api/upload — mengirim satu gambar pada field bernama "file".
// Mengembalikan { filename, originalName, mimeType, size, url }.
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);

  // Content-Type sengaja dikosongkan: axiosClient menyetelnya ke
  // application/json secara global, sedangkan unggahan butuh
  // multipart/form-data lengkap dengan boundary yang hanya bisa dibuat axios
  // sendiri. Memaksanya secara manual membuat multer gagal membaca berkas.
  const body = await axiosClient.post('/upload', form, {
    headers: { 'Content-Type': undefined },
  });

  return body?.data ?? body;
};

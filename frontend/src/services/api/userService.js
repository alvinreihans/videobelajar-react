import axiosClient from './axiosClient';

// Backend membungkus response dalam { success, message, data }.
const unwrap = (res) => res?.data ?? res;

// PATCH /api/users/:id — memperbarui sebagian data user.
// Hanya kolom yang ada di daftar `fillable` milik service users yang diproses;
// field lain diabaikan backend, jadi aman mengirim patch kecil seperti { avatar }.
export const updateUserProfile = async (id, patch) =>
  unwrap(await axiosClient.patch(`/users/${id}`, patch));

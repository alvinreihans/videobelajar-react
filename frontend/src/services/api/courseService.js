import axiosClient from './axiosClient';

// Resource endpoint di MockAPI: /courses
const RESOURCE = '/courses';

// GET — ambil semua kelas
export const getCourses = () => axiosClient.get(RESOURCE);

// GET by id — ambil satu kelas
export const getCourseById = (id) => axiosClient.get(`${RESOURCE}/${id}`);

// ADD — tambah kelas baru (id di-generate oleh server)
export const createCourse = (data) => axiosClient.post(RESOURCE, data);

// UPDATE — ubah kelas berdasarkan id
export const updateCourse = (id, data) =>
  axiosClient.put(`${RESOURCE}/${id}`, data);

// DELETE — hapus kelas berdasarkan id
export const deleteCourse = (id) => axiosClient.delete(`${RESOURCE}/${id}`);

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as courseApi from '../../services/api/courseService';

// ─── ASYNC THUNKS (memanggil fungsi API dari services/api) ───────────────────

// GET — ambil semua kelas untuk katalog.
// courseService yang memilih jalurnya: publik bila belum login, terproteksi
// (JWT) bila sudah login.
export const fetchCourses = createAsyncThunk('courses/fetchAll', async () => {
  return await courseApi.getCourses();
});

// GET — katalog TERFILTER untuk halaman Semua Kelas.
// Hasilnya sengaja disimpan terpisah dari `items`: sembilan halaman lain
// (Beranda, Detail Produk, Pesanan, Kelas Saya, …) membaca `items` sebagai
// katalog penuh, dan tidak boleh ikut menyusut saat pengguna memfilter.
export const fetchCatalog = createAsyncThunk('courses/fetchCatalog', async (params) => {
  return await courseApi.getCourses(params);
});

// ADD — tambah kelas baru
export const addCourse = createAsyncThunk('courses/add', async (data) => {
  return await courseApi.createCourse(data);
});

// UPDATE — ubah kelas berdasarkan id
export const editCourse = createAsyncThunk(
  'courses/edit',
  async ({ id, data }) => {
    return await courseApi.updateCourse(id, data);
  }
);

// DELETE — hapus kelas berdasarkan id
export const removeCourse = createAsyncThunk('courses/remove', async (id) => {
  await courseApi.deleteCourse(id);
  return id;
});

// ─── SLICE ───────────────────────────────────────────────────────────────────

const coursesSlice = createSlice({
  name: 'courses',
  // Initial State: array kosong (items) yang nanti diisi data dari API.
  initialState: {
    // Katalog penuh — sumber data bagi hampir semua halaman.
    items: [],
    loading: false,
    error: null,
    // Katalog hasil filter/sort/search dari server — khusus halaman Semua Kelas.
    catalog: { items: [], loading: false, error: null },
  },
  reducers: {},
  // extraReducers: menangani hasil dari thunk API dan menyimpannya ke state.
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // GET terfilter — hanya menyentuh cabang `catalog`
      .addCase(fetchCatalog.pending, (state) => {
        state.catalog.loading = true;
        state.catalog.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.catalog.loading = false;
        state.catalog.items = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.catalog.loading = false;
        state.catalog.error = action.error.message;
      })
      // ADD — masukkan hasil ke paling depan
      .addCase(addCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // UPDATE — ganti item yang id-nya cocok
      .addCase(editCourse.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // DELETE — buang item berdasarkan id
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default coursesSlice.reducer;

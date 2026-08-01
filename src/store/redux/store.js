import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './coursesSlice';

// Konfigurasi store Redux + daftarkan reducer di sini.
export const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
});

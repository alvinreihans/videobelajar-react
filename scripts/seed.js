// Skrip sekali-jalan untuk mengisi MockAPI dengan data awal (9 kelas).
// Jalankan SETELAH resource /courses dibuat di mockapi.io:
//   node scripts/seed.js
//
// Base URL dibaca dari .env (VITE_API_BASE_URL).

import { readFileSync } from 'node:fs';
import axios from 'axios';
import { initialCourses } from '../src/data/courses.js';

// Baca VITE_API_BASE_URL dari file .env secara sederhana.
function readBaseURL() {
  if (process.env.VITE_API_BASE_URL) return process.env.VITE_API_BASE_URL;
  try {
    const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    const match = env.match(/^VITE_API_BASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // abaikan
  }
  throw new Error('VITE_API_BASE_URL tidak ditemukan di .env');
}

async function seed() {
  const baseURL = readBaseURL();
  console.log('Seeding ke:', `${baseURL}/courses`);

  for (const course of initialCourses) {
    // Buang id lokal — biar id di-generate oleh server.
    const { id, ...payload } = course;
    void id;
    try {
      const res = await axios.post(`${baseURL}/courses`, payload);
      console.log('✓ dibuat:', res.data.id, '-', payload.title);
    } catch (err) {
      console.error('✗ gagal:', payload.title, '-', err.message);
    }
  }

  console.log('Selesai.');
}

seed();

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reset posisi scroll ke atas setiap kali rute (pathname) berubah.
// Tanpa ini, berpindah antar produk lewat "Produk Terkait" akan mempertahankan
// posisi scroll di bawah — user jadi tidak melihat produk baru dari awal.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" agar terasa seperti membuka halaman baru, bukan animasi geser.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

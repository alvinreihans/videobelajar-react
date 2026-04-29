import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6">
      <h1 className="h1 text-text-dark-primary">404</h1>

      <div className="flex flex-col gap-2">
        <h2 className="h4 text-text-dark-primary">Halaman tidak ditemukan</h2>
        <p className="body-md-regular text-text-dark-secondary">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>
      </div>

      <Link to="/">
        <Button variant="contained">Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}

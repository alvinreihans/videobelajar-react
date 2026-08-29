import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6">
      <h1 className="text-h1 font-bold text-text-dark-primary">404</h1>

      <div className="flex flex-col gap-2">
        <h2 className="text-h4 font-bold text-text-dark-primary">
          Halaman tidak ditemukan
        </h2>
        <p className="text-md font-normal text-text-dark-secondary">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>
      </div>

      <Link to="/">
        <Button variant="contained">Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}

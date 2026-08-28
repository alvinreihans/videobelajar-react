import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bungkus rute yang butuh login. Jika belum login, arahkan ke /login sambil
// menyimpan tujuan asal agar bisa dikembalikan setelah berhasil masuk.
export default function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

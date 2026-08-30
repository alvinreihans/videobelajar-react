import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchCourses } from './store/redux/coursesSlice';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageClass from './pages/ManageClass';
import Orders from './pages/Orders';
import MyClasses from './pages/MyClasses';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Learn from './pages/Learn';
import Certificate from './pages/Certificate';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ScrollToTop from './components/ScrollToTop';
import RequireAuth from './components/RequireAuth';

// Bungkus halaman dengan MainLayout (Navigation + Footer).
const withMain = (el) => <MainLayout>{el}</MainLayout>;
// Bungkus halaman yang butuh login + MainLayout.
const guarded = (el) => (
  <RequireAuth>
    <MainLayout>{el}</MainLayout>
  </RequireAuth>
);

function App() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Ambil ulang daftar kelas setiap kali status login berubah, karena jalur
  // endpoint-nya ikut berpindah: publik saat belum login, terproteksi (JWT)
  // setelah login. Tanpa ini perpindahan baru terasa setelah halaman di-refresh.
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch, user?.id]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* PUBLIK */}
        <Route path="/" element={withMain(<Home />)} />
        <Route path="/products" element={withMain(<AllProducts />)} />
        <Route path="/product/:id" element={withMain(<ProductDetail />)} />
        <Route path="/kelola-kelas" element={withMain(<ManageClass />)} />

        {/* AUTH */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* AKUN (butuh login) */}
        <Route path="/profile" element={guarded(<Profile />)} />
        <Route path="/class" element={guarded(<MyClasses />)} />
        <Route path="/orders" element={guarded(<Orders />)} />

        {/* PEMBAYARAN (butuh login, header khusus dengan stepper) */}
        <Route
          path="/checkout/:id"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />

        {/* SERTIFIKAT (butuh login, pakai MainLayout) */}
        <Route path="/certificate/:id" element={guarded(<Certificate />)} />

        {/* BELAJAR (butuh login, layout khusus tanpa Navigation/Footer) */}
        <Route
          path="/learn/:id"
          element={
            <RequireAuth>
              <Learn />
            </RequireAuth>
          }
        />

        {/* 404 */}
        <Route path="*" element={withMain(<NotFound />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

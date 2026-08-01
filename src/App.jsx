import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchCourses } from './store/redux/coursesSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageClass from './pages/ManageClass';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

function App() {
  const dispatch = useDispatch();

  // GET data dari API sekali saat aplikasi dimuat, simpan ke Redux store.
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/kelola-kelas"
          element={
            <MainLayout>
              <ManageClass />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

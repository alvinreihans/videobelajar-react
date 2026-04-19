import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="videobelajar" className="h-6 md:h-8" />
        </Link>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <button className="text-gray-700 font-semibold hover:text-green-500 transition">
                Kategori
              </button>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-[#3ECF4C] hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="border-2 border-[#3ECF4C] text-[#3ECF4C] hover:bg-green-50 font-semibold px-5 py-2 rounded-lg text-sm transition">
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="relative group">
                  <img
                    src="avatar-user.svg"
                    className="w-9 h-9 rounded-md cursor-pointer border"
                  />

                  <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border shadow rounded-lg p-2 min-w-[120px]">
                    <button
                      onClick={logout}
                      className="w-full text-left text-red-500 text-sm hover:bg-gray-100 px-2 py-1 rounded">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

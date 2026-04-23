import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import UnstyledButton from './ui/UnstyledButton';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between">
        <Link to="/">
          <img src="/logo.svg" alt="videobelajar" className="h-6 md:h-8" />
        </Link>

        {!isAuthPage && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <a href="#courses">
                <UnstyledButton>Kategori</UnstyledButton>
              </a>

              {!user ? (
                <>
                  <Link to="/login">
                    <Button color="primary" variant="contained">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button color="primary" variant="outlined">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <img
                    src="avatar-user.svg"
                    className="w-9 h-9 rounded-md cursor-pointer border"
                  />
                  <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border shadow rounded-lg p-2">
                    <Button onClick={logout} color="secondary">
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 focus:outline-none">
                <img src="hamburger.svg" className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dropdown Menu Mobile (Opsional: Muncul saat hamburger diklik) */}
      {isMenuOpen && !isAuthPage && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-3">
          <a href="#courses" className="font-bold text-sm">
            Kategori
          </a>
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-bold text-[#3ECF4C]">
                Login
              </Link>
              <Link to="/register" className="text-sm font-bold text-[#3ECF4C]">
                Register
              </Link>
            </>
          ) : (
            <>
              {' '}
              <img
                src="avatar-user.svg"
                className="w-9 h-9 rounded-md cursor-pointer border"
              />
              <button
                onClick={logout}
                className="text-red-500 text-sm font-bold text-left">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

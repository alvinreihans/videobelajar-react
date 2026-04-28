import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import UnstyledButton from './ui/UnstyledButton';

export default function Navigation({ variant = 'guest' }) {
  const { logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variants = {
    auth: { showNav: false, showButtons: false, showAvatar: false },
    guest: { showNav: true, showButtons: true, showAvatar: false },
    user: { showNav: true, showButtons: false, showAvatar: true },
  };

  const current = variants[variant];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/">
          <img src="/logo.svg" className="h-6 md:h-8" />
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          {current.showNav && (
            <a href="#courses">
              <UnstyledButton className="text-text-dark-secondary font-medium">
                Kategori
              </UnstyledButton>
            </a>
          )}

          {current.showButtons && (
            <>
              <Link to="/login">
                <Button variant="contained">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outlined">Register</Button>
              </Link>
            </>
          )}

          {/* AVATAR + DROPDOWN */}
          {current.showAvatar && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img
                  src="/avatar-user.svg"
                  className="w-9 h-9 rounded-lg border border-border"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[200px] bg-white border border-border shadow-lg rounded-md overflow-hidden z-50">
                  {/* ITEM */}
                  <Link className="block px-3 py-4 text-text-dark-secondary hover:bg-gray-50">
                    Profil Saya
                  </Link>

                  <Link className="block px-3 py-4 text-text-dark-secondary hover:bg-gray-50">
                    Kelas Saya
                  </Link>

                  <Link className="block px-3 py-4 text-text-dark-secondary hover:bg-gray-50">
                    Pesanan Saya
                  </Link>

                  {/* LOGOUT */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-4 text-error hover:bg-error-bg">
                    Keluar
                    <img src="/icon-logout.svg" className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* HAMBURGER */}
        {variant !== 'auth' && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden">
            <img src="/hamburger.svg" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isMenuOpen && variant !== 'auth' && (
        <div className="md:hidden absolute left-0 top-full w-full bg-white shadow-lg border-b border-border z-40">
          {current.showNav && (
            <div className="px-4 py-4 border-b border-border text-text-dark-secondary">
              Kategori
            </div>
          )}

          {current.showAvatar && (
            <>
              <div className="px-4 py-4 border-b border-border text-text-dark-secondary">
                Profil Saya
              </div>

              <div className="px-4 py-4 border-b border-border text-text-dark-secondary">
                Kelas Saya
              </div>

              <div className="px-4 py-4 border-b border-border text-text-dark-secondary">
                Pesanan Saya
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-4 text-error">
                Keluar
                <img src="/icon-logout.svg" className="w-5 h-5" />
              </button>
            </>
          )}

          {current.showButtons && (
            <>
              <Link className="block px-4 py-4 text-primary font-bold border-b border-border">
                Login
              </Link>
              <Link className="block px-4 py-4 text-primary font-bold">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

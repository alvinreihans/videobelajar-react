import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import UnstyledButton from './ui/UnstyledButton';

export default function Navigation({ variant = 'guest' }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const variants = {
    auth: {
      showNav: false,
      showButtons: false,
      showAvatar: false,
    },

    guest: {
      showNav: true,
      showButtons: true,
      showAvatar: false,
    },

    user: {
      showNav: true,
      showButtons: false,
      showAvatar: true,
    },
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
              <UnstyledButton variantStyle="text-text-dark-secondary font-medium">
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

          {current.showAvatar && (
            <div className="relative group">
              <img
                src="avatar-user.svg"
                className="w-9 h-9 rounded-lg border border-border"
              />

              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border border-border shadow rounded-lg p-2">
                <Button onClick={logout} color="secondary">
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE */}
        {variant !== 'auth' && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden">
            <img src="hamburger.svg" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && variant !== 'auth' && (
        <div className="md:hidden bg-white border-b border-border px-4 py-3 flex flex-col gap-3">
          {current.showNav && (
            <a className="text-sm text-text-dark-secondary">Kategori</a>
          )}

          {current.showButtons && (
            <>
              <Link className="text-primary font-bold">Login</Link>
              <Link className="text-primary font-bold">Register</Link>
            </>
          )}

          {current.showAvatar && (
            <>
              <img src="avatar-user.svg" className="w-9 h-9" />
              <button
                onClick={logout}
                className="text-error-default text-sm font-bold text-left">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

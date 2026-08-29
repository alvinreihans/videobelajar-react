import { createContext, useContext, useState } from 'react';
import * as authApi from '../services/api/authService';

const AuthContext = createContext();

function readStoredUser() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Samakan bentuk user dari backend → frontend (halaman Profil dsb. memakai `name`).
function normalizeUser(u = {}) {
  return {
    ...u,
    name: u.full_name || u.name || (u.email ? u.email.split('@')[0] : 'Pengguna'),
    avatar: u.avatar || 'avatar-user.svg',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // LOGIN — panggil backend, simpan token + user. Melempar error bila gagal.
  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password }); // { token, data }
    const nextUser = normalizeUser(res.data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  // REGISTER — panggil backend. Tidak auto-login (akun perlu verifikasi email).
  const register = (payload) => authApi.register(payload);

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Baca user dari localStorage SECARA SINKRON saat inisialisasi state.
// (Sebelumnya via useEffect → sempat null di render pertama, bikin halaman
// terproteksi "berkedip" lalu redirect ke /login walau user sudah login.)
function readStoredUser() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = (data) => {
    // Lengkapi default nama dari email bila belum ada (dipakai halaman Profil).
    const enriched = {
      name: data.name || (data.email ? data.email.split('@')[0] : 'Pengguna'),
      avatar: data.avatar || 'avatar-user.svg',
      ...data,
    };
    setUser(enriched);
    localStorage.setItem('user', JSON.stringify(enriched));
  };

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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

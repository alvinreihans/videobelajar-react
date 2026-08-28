import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Input from '../components/ui/Input';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';
import UnstyledButton from '../components/ui/UnstyledButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Kembali ke halaman asal setelah login (mis. dari tombol "Beli Sekarang").
  const from = location.state?.from || '/';

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[590px] bg-background-primary border border-border rounded-md p-9 flex flex-col gap-9">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-h3 font-bold text-text-dark-primary">
            Masuk ke Akun
          </h1>
          <p className="text-text-dark-secondary text-md font-medium">
            Yuk, lanjutin belajarmu di videobelajar.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <Input
            label="E-Mail"
            required
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Kata Sandi"
            required
            isPassword
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LUPA PASSWORD */}
          <div className="flex justify-end">
            <UnstyledButton className="text-text-dark-secondary hover:text-text-dark-primary">
              Lupa Password?
            </UnstyledButton>
          </div>

          {/* BUTTON */}
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full">
              Masuk
            </Button>

            <Link to="/register">
              <Button
                type="button"
                variant="shadow"
                color="primary"
                className="w-full">
                Daftar
              </Button>
            </Link>
          </div>

          <Divider text="atau" />

          {/* GOOGLE */}
          <UnstyledButton className="w-full border border-border rounded-lg py-2 justify-center">
            <img src="/icon-google.svg" className="w-5 h-5" />
            Masuk dengan Google
          </UnstyledButton>
        </form>
      </div>
    </div>
  );
}

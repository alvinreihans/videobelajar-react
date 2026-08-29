import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../components/ui/Input';
import Divider from '../components/ui/Divider';
import Button from '../components/ui/Button';
import UnstyledButton from '../components/ui/UnstyledButton';
import PhoneInput from '../components/ui/PhoneInput';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError('');
    // Mock: langsung buat sesi & arahkan ke beranda.
    login({ name, email, phone });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[590px] bg-background-primary border border-border rounded-md p-9 flex flex-col gap-9">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-h3 font-bold text-text-dark-primary">
            Pendaftaran Akun
          </h1>
          <p className="text-text-dark-secondary text-md font-medium">
            Yuk, daftarkan akunmu sekarang juga!
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <Input
            label="Nama Lengkap"
            required
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="E-Mail"
            required
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PHONE NUMBER */}
          <PhoneInput
            label="No. Telepon"
            required
            value={phone}
            onChange={setPhone}
          />

          <Input
            label="Kata Sandi"
            required
            isPassword
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Konfirmasi Kata Sandi"
            required
            isPassword
            placeholder="Ulangi password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && (
            <p className="text-sm font-medium text-error -mt-2">{error}</p>
          )}

          {/* BUTTON */}
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full">
              Daftar
            </Button>

            <Link to="/login">
              <Button
                type="button"
                variant="shadow"
                color="primary"
                className="w-full">
                Masuk
              </Button>
            </Link>
          </div>

          <Divider text="atau" />

          {/* GOOGLE */}
          <UnstyledButton className="w-full border border-border rounded-lg py-2 justify-center">
            <img src="/icon-google.svg" className="w-5 h-5" />
            Daftar dengan Google
          </UnstyledButton>
        </form>
      </div>
    </div>
  );
}

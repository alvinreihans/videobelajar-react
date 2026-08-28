import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AccountLayout from '../components/account/AccountLayout';
import Input from '../components/ui/Input';
import PhoneInput from '../components/ui/PhoneInput';
import Button from '../components/ui/Button';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    updateUser({ name, email, phone });
    setTimeout(() => { setSaving(false); setSaved(true); }, 400);
  };

  return (
    <AccountLayout title="Ubah Profil" subtitle="Ubah data diri Anda">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* AVATAR HEADER */}
        <div className="flex items-center gap-4">
          <img
            src={`/${user?.avatar || 'avatar-user.svg'}`}
            alt="Foto profil"
            className="w-16 h-16 rounded-[12px] object-cover border border-border"
          />
          <div className="flex flex-col">
            <p className="font-bold text-text-dark-primary">{name || 'Pengguna'}</p>
            <p className="text-sm text-text-dark-secondary">{email}</p>
            <button
              type="button"
              className="mt-1 text-sm font-semibold text-tertiary hover:underline text-left"
              onClick={() => alert('Fitur ganti foto profil belum tersedia di versi ini.')}>
              Ganti Foto Profil
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-border" />

        {/* FIELDS (satu baris di desktop) */}
        <div className="flex flex-col md:flex-row gap-4 md:items-start">
          <Input
            label="Nama Lengkap"
            className="flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
          />
          <Input
            label="E-Mail"
            type="email"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
          />
          <div className="flex-1">
            <PhoneInput label="No. Hp" value={phone} onChange={setPhone} />
          </div>
        </div>

        {saved && (
          <div role="status" className="rounded-[10px] bg-success-bg text-success px-4 py-3 text-md font-medium">
            Perubahan profil berhasil disimpan.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" color="primary" variant="contained" disabled={saving} className="rounded-[10px] px-8">
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </form>
    </AccountLayout>
  );
}

import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadImage, validateImage } from '../services/api/uploadService';
import { updateUserProfile } from '../services/api/userService';
import { resolveAvatar, UPLOAD_PREFIX } from '../utils/asset';
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

  // ── GANTI FOTO PROFIL (Langkah Ketujuh — Upload Image) ────────────────────
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [photoSaved, setPhotoSaved] = useState(false);

  const handlePickPhoto = async (e) => {
    const file = e.target.files?.[0];
    // Kosongkan input supaya memilih berkas yang sama dua kali tetap memicu onChange.
    e.target.value = '';
    if (!file) return;

    setPhotoError(null);
    setPhotoSaved(false);

    const invalid = validateImage(file);
    if (invalid) { setPhotoError(invalid); return; }

    setUploading(true);
    try {
      // 1. Kirim berkasnya ke server → tersimpan di folder uploads/.
      const uploaded = await uploadImage(file);

      // 2. Simpan jalur relatifnya di kolom `avatar` milik user.
      const avatar = `${UPLOAD_PREFIX}${uploaded.filename}`;
      if (user?.id) await updateUserProfile(user.id, { avatar });

      // 3. Perbarui sesi supaya foto langsung berganti di seluruh halaman.
      updateUser({ avatar });
      setPhotoSaved(true);
    } catch (err) {
      setPhotoError(err.message || 'Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

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
            src={resolveAvatar(user?.avatar)}
            alt="Foto profil"
            className={`w-16 h-16 rounded-[12px] object-cover border border-border transition-opacity ${uploading ? 'opacity-50' : ''}`}
          />
          <div className="flex flex-col">
            <p className="font-bold text-text-dark-primary">{name || 'Pengguna'}</p>
            <p className="text-sm text-text-dark-secondary">{email}</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePickPhoto}
            />
            <button
              type="button"
              disabled={uploading}
              className="mt-1 text-sm font-semibold text-tertiary hover:underline text-left disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}>
              {uploading ? 'Mengunggah…' : 'Ganti Foto Profil'}
            </button>

            {photoError && (
              <p role="alert" className="mt-1 text-sm font-medium text-error">{photoError}</p>
            )}
            {photoSaved && !photoError && (
              <p role="status" className="mt-1 text-sm font-medium text-success">Foto profil diperbarui.</p>
            )}
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

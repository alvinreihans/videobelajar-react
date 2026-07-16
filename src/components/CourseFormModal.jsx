import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import {
  CATEGORIES,
  IMAGE_OPTIONS,
  AVATAR_OPTIONS,
} from '../data/courses';

const EMPTY_FORM = {
  title: '',
  description: '',
  instructor: '',
  jobTitle: '',
  company: '',
  category: 'pemasaran',
  price: '',
  originalPrice: '',
  rating: '4.0',
  students: '',
  image: 'product-img1.png',
  avatar: 'avatar1.svg',
};

// Helper: cari option object dari daftar berdasarkan value string.
const findOption = (options, value) =>
  options.find((opt) => opt.value === value) || options[0];

export default function CourseFormModal({ initialData, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...EMPTY_FORM,
          ...initialData,
          rating: String(initialData.rating ?? ''),
          originalPrice: initialData.originalPrice ?? '',
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Judul kelas wajib diisi';
    if (!form.instructor.trim()) next.instructor = 'Nama tutor wajib diisi';
    if (!form.price.trim()) next.price = 'Harga wajib diisi';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      // onSubmit memanggil API (async). Modal ditutup parent bila sukses.
      await onSubmit({
        ...form,
        title: form.title.trim(),
        instructor: form.instructor.trim(),
        rating: parseFloat(form.rating) || 0,
        originalPrice: form.originalPrice.trim() || null,
        students: form.students.trim() || '0',
      });
    } catch (err) {
      setSubmitError(err.message || 'Gagal menyimpan data');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={onClose}>
      {/* MODAL CARD */}
      <div
        className="w-full max-w-[560px] max-h-full overflow-y-auto bg-background-primary rounded-[10px] shadow-lg"
        onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-background-primary">
          <h2 className="text-h5 font-bold text-text-dark-primary">
            {isEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-dark-secondary hover:bg-grey-100 text-xl leading-none">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <Input
              label="Judul Kelas"
              required
              placeholder="Contoh: UI/UX Design Fundamentals"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
            {errors.title && (
              <span className="text-sm text-error">{errors.title}</span>
            )}
          </div>

          {/* DESKRIPSI */}
          <div className="flex flex-col gap-1.5 w-full">
            <p className="text-sm text-text-dark-secondary font-sans">
              Deskripsi
            </p>
            <textarea
              rows={3}
              placeholder="Deskripsi singkat kelas"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2.5 bg-background-primary shadow-sm outline-none resize-none text-text-dark-primary placeholder:text-text-dark-disabled text-md leading-[140%] font-sans focus:border-primary transition-colors"
            />
          </div>

          {/* TUTOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Nama Tutor"
                required
                placeholder="Nama instruktur"
                value={form.instructor}
                onChange={(e) => setField('instructor', e.target.value)}
              />
              {errors.instructor && (
                <span className="text-sm text-error">{errors.instructor}</span>
              )}
            </div>
            <Input
              label="Jabatan"
              placeholder="Contoh: Product Designer"
              value={form.jobTitle}
              onChange={(e) => setField('jobTitle', e.target.value)}
            />
          </div>

          <Input
            label="Perusahaan"
            placeholder="Contoh: Tokopedia"
            value={form.company}
            onChange={(e) => setField('company', e.target.value)}
          />

          {/* KATEGORI */}
          <Select
            label="Kategori"
            options={CATEGORIES}
            value={findOption(CATEGORIES, form.category)}
            onChange={(opt) => setField('category', opt.value)}
          />

          {/* HARGA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Harga"
                required
                placeholder="Contoh: Rp 250K"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
              />
              {errors.price && (
                <span className="text-sm text-error">{errors.price}</span>
              )}
            </div>
            <Input
              label="Harga Coret (opsional)"
              placeholder="Contoh: Rp 500K"
              value={form.originalPrice}
              onChange={(e) => setField('originalPrice', e.target.value)}
            />
          </div>

          {/* RATING & MURID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rating (0 - 5)"
              type="number"
              step="0.5"
              min="0"
              max="5"
              placeholder="4.5"
              value={form.rating}
              onChange={(e) => setField('rating', e.target.value)}
            />
            <Input
              label="Jumlah Murid"
              placeholder="Contoh: 2.4k"
              value={form.students}
              onChange={(e) => setField('students', e.target.value)}
            />
          </div>

          {/* GAMBAR & AVATAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gambar Kelas"
              options={IMAGE_OPTIONS}
              value={findOption(IMAGE_OPTIONS, form.image)}
              onChange={(opt) => setField('image', opt.value)}
            />
            <Select
              label="Avatar Tutor"
              options={AVATAR_OPTIONS}
              value={findOption(AVATAR_OPTIONS, form.avatar)}
              onChange={(opt) => setField('avatar', opt.value)}
            />
          </div>

          {/* ERROR API */}
          {submitError && (
            <div className="rounded-md bg-error-bg text-error px-3 py-2 text-sm font-medium">
              {submitError}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              color="tertiary"
              variant="outlined"
              disabled={submitting}
              onClick={onClose}
              className="rounded-[10px]">
              Batal
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={submitting}
              className="rounded-[10px]">
              {submitting
                ? 'Menyimpan…'
                : isEdit
                  ? 'Simpan Perubahan'
                  : 'Tambah Kelas'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

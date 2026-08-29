import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import CourseFormModal from '../components/CourseFormModal';
import {
  fetchCourses,
  addCourse,
  editCourse,
  removeCourse,
} from '../store/redux/coursesSlice';
import { TABS } from '../data/courses';

export default function ManageClass() {
  // ─── STATE GLOBAL (dari MockAPI via Redux) ───────────────────────────────
  const dispatch = useDispatch();
  const { items: courses, loading, error } = useSelector(
    (state) => state.courses
  );

  const [activeTab, setActiveTab] = useState('semua');

  // UI state untuk modal & konfirmasi hapus
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = mode tambah
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // ─── READ ────────────────────────────────────────────────────────────────
  const filtered =
    activeTab === 'semua'
      ? courses
      : courses.filter((c) => c.category === activeTab);

  // ─── CREATE / UPDATE (async, via Redux thunk) ────────────────────────────
  // .unwrap() melempar error agar modal menampilkannya & tetap terbuka.
  const handleSubmit = async (data) => {
    if (editing) {
      await dispatch(editCourse({ id: editing.id, data })).unwrap();
    } else {
      await dispatch(addCourse(data)).unwrap();
    }
    closeModal();
  };

  // ─── DELETE (async, via Redux thunk) ─────────────────────────────────────
  const handleDelete = async () => {
    setActionError(null);
    setDeleting(true);
    try {
      await dispatch(removeCourse(deleteTarget.id)).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ─── MODAL HELPERS ───────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 lg:px-[120px] py-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-h3 font-bold text-text-dark-primary">
            Kelola Kelas
          </h1>
          <p className="text-md font-medium text-text-dark-secondary leading-[140%] tracking-[0.2px]">
            Tambah, ubah, dan hapus kelas yang tersedia di platform.
          </p>
        </div>

        <Button
          color="primary"
          variant="contained"
          onClick={openCreate}
          className="rounded-[10px] text-md whitespace-nowrap">
          + Tambah Kelas
        </Button>
      </div>

      {/* STAT */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary text-sm font-semibold">
          {courses.length} Total Kelas
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-grey-100 text-text-dark-secondary text-sm font-semibold">
          {filtered.length} Ditampilkan
        </span>
      </div>

      {/* TABS */}
      <div className="flex items-start overflow-x-auto border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="flex flex-col items-start shrink-0 pr-9">
              <span
                className={`py-3 text-md font-medium leading-[140%] tracking-[0.2px] transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-tertiary'
                    : 'text-text-dark-secondary hover:text-text-dark-primary'
                }`}>
                {tab.label}
              </span>
              <div
                className={`h-[6px] rounded-[10px] transition-all duration-200 bg-tertiary ${
                  isActive ? 'w-[52px]' : 'w-0'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ERROR SAAT AKSI HAPUS */}
      {actionError && (
        <div className="rounded-[10px] bg-error-bg text-error px-4 py-3 text-md font-medium">
          {actionError}
        </div>
      )}

      {/* CONTENT: loading / error / grid */}
      {loading ? (
        <div className="text-center py-16 text-text-dark-secondary text-md font-medium">
          Memuat data kelas…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-md font-medium text-error">
            Gagal memuat data: {error}
          </p>
          <Button
            color="info"
            variant="outlined"
            onClick={() => dispatch(fetchCourses())}
            className="rounded-[10px]">
            Coba Lagi
          </Button>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <ProductCard
              key={course.id}
              {...course}
              to={null}
              actions={
                <>
                  <Button
                    color="info"
                    variant="outlined"
                    onClick={() => openEdit(course)}
                    className="flex-1 rounded-[10px] text-sm">
                    Edit
                  </Button>
                  <Button
                    color="tertiary"
                    variant="contained"
                    onClick={() => setDeleteTarget(course)}
                    className="flex-1 rounded-[10px] text-sm">
                    Hapus
                  </Button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-md font-medium text-text-dark-secondary">
            Belum ada kelas untuk kategori ini.
          </p>
          <Button
            color="primary"
            variant="outlined"
            onClick={openCreate}
            className="rounded-[10px]">
            + Tambah Kelas
          </Button>
        </div>
      )}

      {/* MODAL FORM (CREATE / UPDATE) */}
      {isModalOpen && (
        <CourseFormModal
          initialData={editing}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {/* KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => (deleting ? null : setDeleteTarget(null))}>
          <div
            className="w-full max-w-[400px] bg-background-primary rounded-[10px] shadow-lg p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-h5 font-bold text-text-dark-primary">
              Hapus Kelas?
            </h3>
            <p className="text-md text-text-dark-secondary leading-[140%]">
              Kamu akan menghapus{' '}
              <span className="font-bold text-text-dark-primary">
                {deleteTarget.title}
              </span>
              . Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                color="info"
                variant="outlined"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-[10px]">
                Batal
              </Button>
              <Button
                color="tertiary"
                variant="contained"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-[10px]">
                {deleting ? 'Menghapus…' : 'Ya, Hapus'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

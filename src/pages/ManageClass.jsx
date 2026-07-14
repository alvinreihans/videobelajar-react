import { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import CourseFormModal from '../components/CourseFormModal';
import { useCourses } from '../context/CoursesContext';
import { TABS } from '../data/courses';

export default function ManageClass() {
  // ─── STATE GLOBAL (dibagi dengan Home lewat Context) ─────────────────────
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();

  const [activeTab, setActiveTab] = useState('semua');

  // UI state untuk modal & konfirmasi hapus
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = mode tambah
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ─── READ ────────────────────────────────────────────────────────────────
  const filtered =
    activeTab === 'semua'
      ? courses
      : courses.filter((c) => c.category === activeTab);

  // ─── CREATE / UPDATE ─────────────────────────────────────────────────────
  const handleSubmit = (data) => {
    if (editing) {
      updateCourse(editing.id, data);
    } else {
      addCourse(data);
    }
    closeModal();
  };

  // ─── DELETE ──────────────────────────────────────────────────────────────
  const handleDelete = () => {
    deleteCourse(deleteTarget.id);
    setDeleteTarget(null);
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

      {/* GRID */}
      {filtered.length > 0 ? (
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
          onClick={() => setDeleteTarget(null)}>
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
                onClick={() => setDeleteTarget(null)}
                className="rounded-[10px]">
                Batal
              </Button>
              <Button
                color="tertiary"
                variant="contained"
                onClick={handleDelete}
                className="rounded-[10px]">
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

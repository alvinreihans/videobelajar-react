import { createContext, useContext, useState, useEffect } from 'react';
import { initialCourses } from '../data/courses';

const CoursesContext = createContext();

const STORAGE_KEY = 'courses';

export function CoursesProvider({ children }) {
  // Ambil dari localStorage jika ada, kalau tidak pakai seed data awal.
  const [courses, setCourses] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCourses;
  });

  // Setiap kali courses berubah, simpan ke localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // ─── CREATE ──────────────────────────────────────────────────────────────
  const addCourse = (data) => {
    setCourses((prev) => {
      const nextId = prev.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      return [{ id: nextId, ...data }, ...prev];
    });
  };

  // ─── UPDATE ──────────────────────────────────────────────────────────────
  const updateCourse = (id, data) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  // ─── DELETE ──────────────────────────────────────────────────────────────
  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Kembalikan ke data awal (opsional, berguna untuk reset).
  const resetCourses = () => setCourses(initialCourses);

  return (
    <CoursesContext.Provider
      value={{ courses, addCourse, updateCourse, deleteCourse, resetCourses }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}

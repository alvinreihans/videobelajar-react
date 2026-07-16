import { createContext, useContext, useState, useEffect } from 'react';
import * as courseApi from '../services/api/courseService';

const CoursesContext = createContext();

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── GET — ambil data dari MockAPI saat pertama render ────────────────────
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseApi.getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ─── ADD — POST lalu masukkan hasilnya ke state ───────────────────────────
  const addCourse = async (data) => {
    const created = await courseApi.createCourse(data);
    setCourses((prev) => [created, ...prev]);
    return created;
  };

  // ─── UPDATE — PUT lalu ganti item di state ────────────────────────────────
  const updateCourse = async (id, data) => {
    const updated = await courseApi.updateCourse(id, data);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  // ─── DELETE — hapus di server lalu buang dari state ───────────────────────
  const deleteCourse = async (id) => {
    await courseApi.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        loading,
        error,
        refetch: fetchCourses,
        addCourse,
        updateCourse,
        deleteCourse,
      }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}

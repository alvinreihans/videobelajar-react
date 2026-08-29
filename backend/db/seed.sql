-- =====================================================================
--  SEED DATA — Aplikasi Video Belajar (Edu Course)
--  Data contoh yang diturunkan dari data frontend (src/data/*.js) supaya
--  setiap endpoint langsung mengembalikan data yang realistis.
--  Jalankan SETELAH schema.sql.
-- =====================================================================
USE videobelajar;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE material_progress;
TRUNCATE TABLE reviews;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE pretest_questions;
TRUNCATE TABLE pretests;
TRUNCATE TABLE quiz_questions;
TRUNCATE TABLE materials;
TRUNCATE TABLE modules;
TRUNCATE TABLE courses;
TRUNCATE TABLE categories;
TRUNCATE TABLE tutors;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. USERS ─────────────────────────────────────────────────────────
-- Catatan: password_hash di bawah hanya contoh (bukan hash asli).
INSERT INTO users (id, full_name, username, email, password_hash, phone, avatar, role) VALUES
  (1, 'Admin Videobelajar', 'admin', 'admin@videobelajar.id',            '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000001', '081200000001', 'avatar1.svg', 'admin'),
  (2, 'Rina Saputra', 'rina',       'rina@videobelajar.id',             '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000002', '081200000002', 'avatar1.svg', 'tutor'),
  (3, 'Kevin Tan', 'kevin',          'kevin@videobelajar.id',            '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000003', '081200000003', 'avatar2.svg', 'tutor'),
  (4, 'Jenna Ortega', 'jenna',       'jenna@videobelajar.id',            '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000004', '081200000004', 'avatar3.svg', 'tutor'),
  (5, 'Alvin Makarim', 'alvinmakarim',      'alvinreihans@gmail.com',  '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000005', '081200000005', 'avatar5.svg', 'student'),
  (6, 'Gregorius Edrik', 'gregorius',    'gregorius@example.com',            '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000006', '081200000006', 'avatar6.svg', 'student'),
  (7, 'Ayu Kartika', 'ayu',        'ayu@example.com',                  '$2b$10$SeedHashContohSajaTidakDipakaiLogin000000000007', '081200000007', 'avatar7.svg', 'student');

-- Data seed dianggap akun terverifikasi.
UPDATE users SET is_verified = 1;

-- ── 2. TUTORS ────────────────────────────────────────────────────────
INSERT INTO tutors (id, user_id, name, job_title, company, bio, avatar) VALUES
  (1, 2,    'Rina Saputra',  'Senior Accountant',   'Gojek',     'Berkarier di bidang akuntansi & audit lebih dari 8 tahun.', 'avatar1.svg'),
  (2, 3,    'Kevin Tan',     'Digital Marketer',    'Shopee',    'Praktisi digital ads dengan spesialisasi Meta & Google Ads.', 'avatar2.svg'),
  (3, 4,    'Jenna Ortega',  'Product Designer',    'Tokopedia', 'Product Designer yang fokus pada riset & design system.',     'avatar3.svg'),
  (4, NULL, 'Budi Santoso',  'Communication Coach', 'Traveloka', 'Melatih public speaking untuk profesional & mahasiswa.',      'avatar4.svg'),
  (5, NULL, 'Sari Dewi',     'Marketing Lead',      'Bukalapak', 'Marketing strategist berpengalaman di e-commerce.',           'avatar5.svg'),
  (6, NULL, 'Ahmad Fauzi',   'Business Analyst',    'Grab',      'Membantu startup menyusun strategi business development.',     'avatar6.svg'),
  (7, NULL, 'Maya Putri',    'Illustrator',         'Kaskus',    'Illustrator digital, pengguna Procreate sejak 2016.',         'avatar7.svg'),
  (8, NULL, 'Hana Wijaya',   'Life Coach',          'Welltech',  'Life coach bersertifikat, fokus mindfulness & produktivitas.','avatar8.svg'),
  (9, NULL, 'Doni Kusuma',   'Finance Analyst',     'Astra',     'Finance analyst yang gemar mengajar Excel tingkat lanjut.',   'avatar3.svg');

-- ── 3. CATEGORIES ────────────────────────────────────────────────────
INSERT INTO categories (id, slug, name) VALUES
  (1, 'pemasaran',          'Pemasaran'),
  (2, 'desain',             'Desain'),
  (3, 'pengembangan-diri',  'Pengembangan Diri'),
  (4, 'bisnis',             'Bisnis');

-- ── 4. COURSES ───────────────────────────────────────────────────────
INSERT INTO courses (id, category_id, tutor_id, title, slug, description, price, original_price, rating, students_count, image, language, status) VALUES
  (1, 4, 1, 'Big 4 Auditor Financial Analyst',      'big-4-auditor-financial-analyst',   'Mulai transformasi dengan instruktur profesional, harga terjangkau, dan kurikulum terbaik.',      300000, NULL,   4.00,   86, 'product-img1.png', 'Bahasa Indonesia', 'published'),
  (2, 1, 2, 'Social Media Ads Mastery',             'social-media-ads-mastery',          'Optimalkan iklan di Facebook & Instagram untuk meningkatkan penjualan secara signifikan.',        250000, NULL,   4.00, 1100, 'product-img2.png', 'Bahasa Indonesia', 'published'),
  (3, 2, 3, 'UI/UX Design Fundamentals',            'ui-ux-design-fundamentals',         'Pelajari prinsip desain modern untuk menciptakan pengalaman pengguna yang luar biasa.',           180000, 300000, 4.50, 2400, 'product-img3.png', 'Bahasa Indonesia', 'published'),
  (4, 3, 4, 'Public Speaking Mastery',              'public-speaking-mastery',           'Tingkatkan kepercayaan diri dan kemampuan berbicara di depan umum secara profesional.',           150000, NULL,   3.50,  900, 'product-img4.png', 'Bahasa Indonesia', 'published'),
  (5, 1, 5, 'Digital Marketing Strategy',           'digital-marketing-strategy',        'Kuasai strategi pemasaran digital yang efektif untuk mengembangkan bisnis di era modern.',        320000, 500000, 4.00, 3200, 'product-img5.png', 'Bahasa Indonesia', 'published'),
  (6, 4, 6, 'Business Development Essentials',       'business-development-essentials',    'Pahami dasar-dasar pengembangan bisnis untuk membawa perusahaan ke level berikutnya.',            200000, NULL,   3.50, 1500, 'product-img6.png', 'Bahasa Indonesia', 'published'),
  (7, 2, 7, 'Ilustrasi Digital dengan Procreate',   'ilustrasi-digital-dengan-procreate', 'Ciptakan karya seni digital yang menakjubkan menggunakan Procreate dari nol.',                    175000, 250000, 4.50,  780, 'product-img7.png', 'Bahasa Indonesia', 'published'),
  (8, 3, 8, 'Mindfulness & Produktivitas',          'mindfulness-produktivitas',         'Temukan keseimbangan hidup dan tingkatkan produktivitas dengan teknik mindfulness terbukti.',     130000, NULL,   4.00, 2100, 'product-img8.png', 'Bahasa Indonesia', 'published'),
  (9, 4, 9, 'Advanced Excel for Business',          'advanced-excel-for-business',       'Pelajari teknik Excel tingkat lanjut untuk analisis data bisnis yang powerful dan efisien.',      100000, 300000, 3.50, 4000, 'product-img9.png', 'Bahasa Indonesia', 'published');

-- ── 5. MODULES ───────────────────────────────────────────────────────
INSERT INTO modules (id, course_id, title, position) VALUES
  (1, 3, 'Introduction to Course: Foundations',            1),
  (2, 3, 'Universal, inclusive, & equity-focused design',  2),
  (3, 3, 'Introduction to UX research',                    3),
  (4, 1, 'Dasar Audit & Laporan Keuangan',                 1),
  (5, 1, 'Analisis Rasio Keuangan',                        2);

-- ── 6. MATERIALS ─────────────────────────────────────────────────────
INSERT INTO materials (id, module_id, type, title, content_url, duration_minutes, position) VALUES
  (1, 1, 'video',   'The basics of user experience design', 'https://videos.example.com/uiux/basics.mp4', 12, 1),
  (2, 1, 'summary', 'Rangkuman: Foundations',               'https://docs.example.com/uiux/foundations.pdf', 5, 2),
  (3, 1, 'quiz',    'Quiz: Foundations',                    NULL, NULL, 3),
  (4, 2, 'video',   'Universal & inclusive design',         'https://videos.example.com/uiux/inclusive.mp4', 15, 1),
  (5, 4, 'video',   'Pengantar Audit Keuangan',             'https://videos.example.com/audit/intro.mp4', 20, 1);

-- ── 7. QUIZ_QUESTIONS ────────────────────────────────────────────────
INSERT INTO quiz_questions (id, material_id, question, options, answer_index) VALUES
  (1, 3, 'Proses membuat kerangka low-fidelity dari sebuah antarmuka disebut?', '["Prototyping","Wireframing","User testing","Benchmarking"]', 1),
  (2, 3, 'Prinsip desain yang memastikan produk dapat digunakan semua orang termasuk penyandang disabilitas?', '["Aesthetic design","Accessibility","Minimalism","Skeuomorphism"]', 1);

-- ── 8. PRETESTS ──────────────────────────────────────────────────────
INSERT INTO pretests (id, course_id, title, passing_score) VALUES
  (1, 3, 'Pre-Test: UI/UX Design Fundamentals', 70),
  (2, 1, 'Pre-Test: Financial Analyst',          60);

-- ── 9. PRETEST_QUESTIONS ─────────────────────────────────────────────
INSERT INTO pretest_questions (id, pretest_id, question, options, answer_index) VALUES
  (1, 1, 'Tahapan design thinking yang benar adalah?', '["Empathize -> Define -> Ideate -> Prototype -> Test","Test -> Ideate -> Define -> Empathize -> Prototype","Define -> Test -> Empathize -> Ideate -> Prototype","Ideate -> Empathize -> Test -> Define -> Prototype"]', 0),
  (2, 1, 'Kumpulan komponen UI yang konsisten dan dapat dipakai ulang disebut?', '["Moodboard","Design system","Wireframe kit","Grid layout"]', 1);

-- ── 10. ORDERS ───────────────────────────────────────────────────────
INSERT INTO orders (id, user_id, invoice_number, status, subtotal, admin_fee, total) VALUES
  (1, 5, 'HEL/VI/10001', 'paid',    180000, 7000, 187000),
  (2, 5, 'HEL/VI/10002', 'pending', 300000, 7000, 307000);

-- ── 11. ORDER_ITEMS ──────────────────────────────────────────────────
INSERT INTO order_items (id, order_id, course_id, price) VALUES
  (1, 1, 3, 180000),
  (2, 2, 1, 300000);

-- ── 12. PAYMENTS ─────────────────────────────────────────────────────
INSERT INTO payments (id, order_id, method, method_group, amount, va_number, status, paid_at, expired_at) VALUES
  (1, 1, 'bca', 'bank',    187000, '8881000010001', 'success', '2024-06-01 10:15:00', NULL),
  (2, 2, 'ovo', 'ewallet', 307000, NULL,            'pending', NULL,                  '2024-06-03 23:59:00');

-- ── 13. ENROLLMENTS ──────────────────────────────────────────────────
INSERT INTO enrollments (id, user_id, course_id, order_id, progress, done_modules, total_modules, status) VALUES
  (1, 5, 3, 1, 40, 1, 3, 'ongoing');

-- ── 14. MATERIAL_PROGRESS ────────────────────────────────────────────
INSERT INTO material_progress (id, enrollment_id, material_id, is_completed, completed_at) VALUES
  (1, 1, 1, TRUE,  '2024-06-02 09:00:00'),
  (2, 1, 2, FALSE, NULL);

-- ── 15. REVIEWS ──────────────────────────────────────────────────────
INSERT INTO reviews (id, user_id, course_id, rating, comment) VALUES
  (1, 5, 3, 4.5, 'Materinya jelas dan aplikatif. Sangat direkomendasikan untuk pemula!'),
  (2, 6, 3, 5.0, 'Tutor sangat berpengalaman dan penjelasannya mudah diikuti.'),
  (3, 7, 1, 4.0, 'Kursus audit yang solid, cocok untuk yang baru masuk dunia finance.');

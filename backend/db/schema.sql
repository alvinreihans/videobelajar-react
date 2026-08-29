-- =====================================================================
--  SCHEMA DATABASE — Aplikasi Video Belajar (Edu Course)
--  Terjemahan ERD (15 tabel) menjadi struktur database MySQL 8 / InnoDB.
--  Charset utf8mb4. Urutan pembuatan tabel mengikuti dependensi foreign key.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS videobelajar
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE videobelajar;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Hapus tabel lama (bila ada) agar skrip bisa dijalankan ulang.
DROP TABLE IF EXISTS material_progress;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS pretest_questions;
DROP TABLE IF EXISTS pretests;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tutors;
DROP TABLE IF EXISTS users;

-- 1. USERS
CREATE TABLE users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name      VARCHAR(100)    NOT NULL,
  username       VARCHAR(50)     NULL,
  email          VARCHAR(150)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,
  phone          VARCHAR(20)     NULL,
  avatar         VARCHAR(100)    NULL,
  role           ENUM('student','tutor','admin') NOT NULL DEFAULT 'student',
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TUTORS
CREATE TABLE tutors (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NULL,
  name       VARCHAR(100)    NOT NULL,
  job_title  VARCHAR(100)    NULL,
  company    VARCHAR(100)    NULL,
  bio        TEXT            NULL,
  avatar     VARCHAR(100)    NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tutors_user (user_id),
  CONSTRAINT fk_tutors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. CATEGORIES
CREATE TABLE categories (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(50)  NOT NULL,
  name       VARCHAR(50)  NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. COURSES
CREATE TABLE courses (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id    INT UNSIGNED    NOT NULL,
  tutor_id       BIGINT UNSIGNED NOT NULL,
  title          VARCHAR(150)    NOT NULL,
  slug           VARCHAR(170)    NOT NULL,
  description    TEXT            NULL,
  price          INT UNSIGNED    NOT NULL DEFAULT 0,
  original_price INT UNSIGNED    NULL,
  rating         DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  students_count INT UNSIGNED    NOT NULL DEFAULT 0,
  image          VARCHAR(120)    NULL,
  language       VARCHAR(50)     NOT NULL DEFAULT 'Bahasa Indonesia',
  status         ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_slug (slug),
  KEY idx_courses_cat_status (category_id, status),
  KEY idx_courses_price (price),
  KEY idx_courses_rating (rating),
  CONSTRAINT fk_courses_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_courses_tutor    FOREIGN KEY (tutor_id)    REFERENCES tutors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. MODULES
CREATE TABLE modules (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id  BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(150)    NOT NULL,
  position   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_modules_course_pos (course_id, position),
  CONSTRAINT fk_modules_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. MATERIALS
CREATE TABLE materials (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  module_id        BIGINT UNSIGNED NOT NULL,
  type             ENUM('video','summary','quiz') NOT NULL,
  title            VARCHAR(150)    NOT NULL,
  content_url      VARCHAR(255)    NULL,
  duration_minutes SMALLINT UNSIGNED NULL,
  position         SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_materials_module_pos (module_id, position),
  CONSTRAINT fk_materials_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. QUIZ_QUESTIONS
CREATE TABLE quiz_questions (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  material_id  BIGINT UNSIGNED NOT NULL,
  question     TEXT            NOT NULL,
  options      JSON            NOT NULL,
  answer_index TINYINT UNSIGNED NOT NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_quizq_material (material_id),
  CONSTRAINT fk_quizq_material FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. PRETESTS
CREATE TABLE pretests (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  course_id     BIGINT UNSIGNED NOT NULL,
  title         VARCHAR(150)    NOT NULL,
  passing_score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pretests_course (course_id),
  CONSTRAINT fk_pretests_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. PRETEST_QUESTIONS
CREATE TABLE pretest_questions (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pretest_id   BIGINT UNSIGNED NOT NULL,
  question     TEXT            NOT NULL,
  options      JSON            NOT NULL,
  answer_index TINYINT UNSIGNED NOT NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pretestq_pretest (pretest_id),
  CONSTRAINT fk_pretestq_pretest FOREIGN KEY (pretest_id) REFERENCES pretests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. ORDERS
CREATE TABLE orders (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        BIGINT UNSIGNED NOT NULL,
  invoice_number VARCHAR(30)     NOT NULL,
  status         ENUM('pending','paid','failed','expired','cancelled') NOT NULL DEFAULT 'pending',
  subtotal       INT UNSIGNED    NOT NULL DEFAULT 0,
  admin_fee      INT UNSIGNED    NOT NULL DEFAULT 0,
  total          INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_invoice (invoice_number),
  KEY idx_orders_user_status (user_id, status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ORDER_ITEMS
CREATE TABLE order_items (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id   BIGINT UNSIGNED NOT NULL,
  course_id  BIGINT UNSIGNED NOT NULL,
  price      INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orderitem (order_id, course_id),
  KEY idx_orderitem_course (course_id),
  CONSTRAINT fk_orderitem_order  FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_course FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. PAYMENTS
CREATE TABLE payments (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id     BIGINT UNSIGNED NOT NULL,
  method       VARCHAR(20)     NOT NULL,
  method_group ENUM('bank','ewallet','card') NOT NULL,
  amount       INT UNSIGNED    NOT NULL,
  va_number    VARCHAR(30)     NULL,
  status       ENUM('pending','success','failed','expired') NOT NULL DEFAULT 'pending',
  paid_at      TIMESTAMP       NULL,
  expired_at   TIMESTAMP       NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_order (order_id),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. ENROLLMENTS
CREATE TABLE enrollments (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       BIGINT UNSIGNED NOT NULL,
  course_id     BIGINT UNSIGNED NOT NULL,
  order_id      BIGINT UNSIGNED NULL,
  progress      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  done_modules  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  total_modules SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  status        ENUM('not_started','ongoing','done') NOT NULL DEFAULT 'not_started',
  enrolled_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enroll_user_course (user_id, course_id),
  KEY idx_enroll_user_status (user_id, status),
  KEY idx_enroll_course (course_id),
  CONSTRAINT fk_enroll_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_enroll_order  FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. MATERIAL_PROGRESS
CREATE TABLE material_progress (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  enrollment_id BIGINT UNSIGNED NOT NULL,
  material_id   BIGINT UNSIGNED NOT NULL,
  is_completed  BOOLEAN         NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMP       NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_matprog (enrollment_id, material_id),
  KEY idx_matprog_material (material_id),
  CONSTRAINT fk_matprog_enroll   FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
  CONSTRAINT fk_matprog_material FOREIGN KEY (material_id)   REFERENCES materials(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. REVIEWS
CREATE TABLE reviews (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  course_id  BIGINT UNSIGNED NOT NULL,
  rating     DECIMAL(2,1)    NOT NULL,
  comment    TEXT            NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_user_course (user_id, course_id),
  KEY idx_reviews_course (course_id),
  CONSTRAINT fk_reviews_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

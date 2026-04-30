CREATE DATABASE IF NOT EXISTS trainer_assessment_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trainer_assessment_system;

CREATE TABLE IF NOT EXISTS supervisors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supervisor_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS question_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supervisor_id INT NOT NULL,
  category_id INT NOT NULL,
  question_type ENUM('mcq', 'descriptive') NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NULL,
  option_b TEXT NULL,
  option_c TEXT NULL,
  option_d TEXT NULL,
  correct_option ENUM('A', 'B', 'C', 'D') NULL,
  expected_answer TEXT NULL,
  explanation TEXT NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES question_categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supervisor_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  pass_percentage DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  status ENUM('draft', 'active', 'closed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL,
  question_id INT NOT NULL,
  marks DECIMAL(6,2) NOT NULL DEFAULT 1.00,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_assessment_question (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL,
  trainer_id INT NOT NULL,
  total_marks DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  obtained_marks DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  correct_count INT NOT NULL DEFAULT 0,
  wrong_count INT NOT NULL DEFAULT 0,
  status ENUM('Pass', 'Fail', 'Pending Review') NOT NULL DEFAULT 'Pending Review',
  evaluation_status ENUM('auto_evaluated', 'needs_review', 'reviewed') NOT NULL DEFAULT 'auto_evaluated',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trainer_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  result_id INT NOT NULL,
  trainer_id INT NOT NULL,
  assessment_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option ENUM('A', 'B', 'C', 'D') NULL,
  descriptive_answer TEXT NULL,
  is_correct TINYINT(1) NULL,
  marks_awarded DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  supervisor_remarks TEXT NULL,
  feedback_comments TEXT NULL,
  evaluation_status ENUM('auto_evaluated', 'needs_review', 'reviewed') NOT NULL DEFAULT 'auto_evaluated',
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

INSERT IGNORE INTO question_categories (name) VALUES
('Cable preparation'),
('Polishing'),
('Inspection'),
('Defect identification'),
('Rework decisions');

INSERT IGNORE INTO supervisors (id, name, email, password)
VALUES (1, 'Demo Supervisor', 'supervisor@example.com', '$2y$10$H49qpncWCBiGLGn29T626.dh7.e5sEQ/nPzIKcWHOzlLXcg1fIOUi');

INSERT IGNORE INTO trainers (id, supervisor_id, name, email, password, status)
VALUES (1, 1, 'Demo Trainer', 'trainer@example.com', '$2y$10$H49qpncWCBiGLGn29T626.dh7.e5sEQ/nPzIKcWHOzlLXcg1fIOUi', 'active');

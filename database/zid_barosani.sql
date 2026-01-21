-- Baza de date pentru Zidul Barosanilor
-- Import acest fișier în phpMyAdmin

CREATE DATABASE IF NOT EXISTS `zid_barosani` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `zid_barosani`;

-- Tabel pentru utilizatori admin
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','moderator') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserare user admin default
-- Username: admin
-- Password: Barosan2025!
INSERT INTO `users` (`username`, `password`, `email`, `role`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@zidulbarosanilor.ro', 'admin');

-- Tabel pentru barosani (membrii afișați pe zid)
CREATE TABLE IF NOT EXISTS `barosani` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nume` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `revolut_id` varchar(50) NOT NULL,
  `motto` varchar(200) NOT NULL,
  `tier` enum('basic','gold','platinum') NOT NULL DEFAULT 'basic',
  `poza` text,
  `link` varchar(255) DEFAULT NULL,
  `certificat_id` varchar(50) NOT NULL,
  `data_inregistrare` date NOT NULL,
  `data_expirare` date NOT NULL,
  `status` enum('active','expired','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificat_id` (`certificat_id`),
  KEY `tier` (`tier`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Date demo pentru barosani
INSERT INTO `barosani` (`nume`, `email`, `revolut_id`, `motto`, `tier`, `poza`, `link`, `certificat_id`, `data_inregistrare`, `data_expirare`, `status`) VALUES
('Alexandru Mega', 'alex@example.com', 'alexmega', 'Viața e prea scurtă ca să nu fii barosan', 'platinum', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://instagram.com/alexmega', 'BRS-2025-0001', '2025-01-10', '2025-02-10', 'active'),
('Maria Șmechera', 'maria@example.com', 'mariasm', 'Barosană de când mă știu', 'gold', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', NULL, 'BRS-2025-0002', '2025-01-11', '2025-02-11', 'active'),
('Ion Gigel', 'ion@example.com', 'iongigel', 'Barosanul oficial al cartierului', 'basic', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', NULL, 'BRS-2025-0003', '2025-01-12', '2025-02-12', 'active'),
('Andrei Cool', 'andrei@example.com', 'andreicool', 'Cel mai tare din oraș', 'platinum', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'https://instagram.com/andreicool', 'BRS-2025-0004', '2025-01-10', '2025-02-10', 'active'),
('Elena Diva', 'elena@example.com', 'elenadiva', 'Regina barosanelor', 'gold', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', NULL, 'BRS-2025-0005', '2025-01-11', '2025-02-11', 'active');

-- Tabel pentru cereri (applications)
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `nume` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `revolut_id` varchar(50) NOT NULL,
  `motto` varchar(200) NOT NULL,
  `tier` enum('basic','gold','platinum','suprem') NOT NULL DEFAULT 'basic',
  `suprem_hours` int DEFAULT NULL,
  `poza` text,
  `link` varchar(255) DEFAULT NULL,
  `suma` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected','payment_confirmed') DEFAULT 'pending',
  `admin_notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel pentru setări site
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Setări default
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('revolut_username', '@username-revolut'),
('contact_email', 'contact@zidulbarosanilor.ro'),
('price_basic', '20'),
('price_gold', '50'),
('price_platinum', '100'),
('site_maintenance', '0');

-- Tabel pentru log-uri admin
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View pentru statistici
CREATE OR REPLACE VIEW `statistics` AS
SELECT
  (SELECT COUNT(*) FROM barosani WHERE status = 'active') as total_barosani,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND tier = 'platinum') as platinum_count,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND tier = 'gold') as gold_count,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND tier = 'basic') as basic_count,
  (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
  (SELECT SUM(suma) FROM applications WHERE status = 'approved' AND MONTH(created_at) = MONTH(CURRENT_DATE())) as monthly_revenue;

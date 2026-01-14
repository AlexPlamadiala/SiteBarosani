-- Migration pentru Expiry Notifications System
-- Rulează acest script pentru a adăuga tabelul de notificări expirare

USE `zid_barosani`;

-- Tabel pentru tracking notificări expirare
CREATE TABLE IF NOT EXISTS `expiry_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `barosan_id` int(11) NOT NULL,
  `notification_type` enum('30days','7days','1day') NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email_sent` tinyint(1) DEFAULT 0,
  `email_error` text,
  PRIMARY KEY (`id`),
  KEY `barosan_id` (`barosan_id`),
  KEY `notification_type` (`notification_type`),
  FOREIGN KEY (`barosan_id`) REFERENCES `barosani`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_notification` (`barosan_id`, `notification_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pentru query-uri rapide
CREATE INDEX idx_sent_at ON expiry_notifications(sent_at);

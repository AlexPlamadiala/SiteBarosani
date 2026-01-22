-- Migration: Add upgrade system with email verification
-- Run this migration to enable tier upgrades

-- Add upgrade_token and tier_history to barosani table
ALTER TABLE `barosani`
  ADD COLUMN IF NOT EXISTS `upgrade_token` VARCHAR(64) DEFAULT NULL AFTER `status`,
  ADD COLUMN IF NOT EXISTS `tier_history` JSON DEFAULT NULL AFTER `upgrade_token`;

-- Add unique index on email (if not exists)
-- First check if index exists, if not create it
SET @exists = (SELECT COUNT(*) FROM information_schema.statistics
               WHERE table_schema = DATABASE()
               AND table_name = 'barosani'
               AND index_name = 'unique_email');
SET @sql = IF(@exists = 0,
              'ALTER TABLE barosani ADD UNIQUE INDEX unique_email (email)',
              'SELECT "Index already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add unique index on upgrade_token
ALTER TABLE `barosani`
  ADD UNIQUE INDEX IF NOT EXISTS `unique_upgrade_token` (`upgrade_token`);

-- Create verification_tokens table for email verification
CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(64) NOT NULL,
  `type` enum('upgrade', 'new_registration') NOT NULL DEFAULT 'upgrade',
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `barosan_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `email` (`email`),
  KEY `barosan_id` (`barosan_id`),
  FOREIGN KEY (`barosan_id`) REFERENCES `barosani`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update applications table to support upgrade requests
ALTER TABLE `applications`
  ADD COLUMN IF NOT EXISTS `is_upgrade` tinyint(1) DEFAULT 0 AFTER `link`,
  ADD COLUMN IF NOT EXISTS `existing_barosan_id` int(11) DEFAULT NULL AFTER `is_upgrade`,
  ADD COLUMN IF NOT EXISTS `previous_tier` enum('basic','gold','platinum','suprem') DEFAULT NULL AFTER `existing_barosan_id`;

-- Add foreign key for existing_barosan_id
ALTER TABLE `applications`
  ADD CONSTRAINT `fk_existing_barosan`
  FOREIGN KEY (`existing_barosan_id`) REFERENCES `barosani`(`id`)
  ON DELETE SET NULL;

-- Migration: Add suprem tier support
-- Date: 2026-01-21

-- Add suprem to tier enum in applications table
ALTER TABLE applications MODIFY COLUMN tier ENUM('basic','gold','platinum','suprem') NOT NULL DEFAULT 'basic';

-- Add suprem_hours column for tracking hours purchased
ALTER TABLE applications ADD COLUMN IF NOT EXISTS suprem_hours INT DEFAULT NULL AFTER tier;

-- Modify barosani_suprem pachet column to accept any hour value
ALTER TABLE barosani_suprem MODIFY COLUMN pachet VARCHAR(20) NOT NULL DEFAULT '1h';

-- Add deactivated status to barosani_suprem
ALTER TABLE barosani_suprem MODIFY COLUMN status ENUM('active','expired','deactivated') DEFAULT 'active';

-- Tabel pentru Barosanul Suprem (featured temporar pe prima pagină)
-- Un singur barosan poate fi "suprem" la un moment dat

USE `zid_barosani`;

-- Creează tabelul pentru Barosanul Suprem
CREATE TABLE IF NOT EXISTS `barosani_suprem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nume` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `revolut_id` varchar(50) NOT NULL,
  `motto` varchar(200) NOT NULL,
  `poza` text,
  `link` varchar(255) DEFAULT NULL,
  `pachet` enum('1h','12h','24h') NOT NULL DEFAULT '1h',
  `suma_platita` decimal(10,2) NOT NULL,
  `data_start` datetime NOT NULL,
  `data_expirare` datetime NOT NULL,
  `status` enum('active','expired') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `data_expirare` (`data_expirare`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adaugă setări pentru prețurile Barosan Suprem
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('price_suprem_1h', '50'),
('price_suprem_12h', '450'),
('price_suprem_24h', '800')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- =====================================================
-- INSERT BAROSAN SUPREM - 22 ore rămase
-- (simulează că a cumpărat pachetul de 24h cu 2 ore în urmă)
-- =====================================================

-- Marchează orice barosani suprem anteriori ca expirați
UPDATE `barosani_suprem` SET `status` = 'expired' WHERE `status` = 'active';

-- Inserează noul Barosan Suprem (22h rămase = cumpărat acum 2 ore, pachet 24h)
INSERT INTO `barosani_suprem` (
  `nume`,
  `email`,
  `revolut_id`,
  `motto`,
  `poza`,
  `link`,
  `pachet`,
  `suma_platita`,
  `data_start`,
  `data_expirare`,
  `status`
) VALUES (
  'Bogdan "Regele" Ionescu',
  'bogdan.suprem@example.com',
  '@bogdanrege',
  'Nu sunt bogat, dar sunt SUPREM! 👑💎🔥',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://instagram.com/bogdan_regele',
  '24h',
  800.00,
  DATE_SUB(NOW(), INTERVAL 2 HOUR),  -- a început acum 2 ore
  DATE_ADD(NOW(), INTERVAL 22 HOUR),  -- expiră peste 22 ore
  'active'
);

-- Verificare - afișează barosanul suprem activ
SELECT
  id,
  nume,
  motto,
  pachet,
  suma_platita,
  data_start,
  data_expirare,
  TIMESTAMPDIFF(HOUR, NOW(), data_expirare) as ore_ramase,
  TIMESTAMPDIFF(MINUTE, NOW(), data_expirare) as minute_ramase,
  status
FROM `barosani_suprem`
WHERE `status` = 'active'
ORDER BY `data_expirare` DESC
LIMIT 1;

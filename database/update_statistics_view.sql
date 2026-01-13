-- Actualizare view statistics pentru verificări corecte

DROP VIEW IF EXISTS `statistics`;

CREATE VIEW `statistics` AS
SELECT
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND data_expirare >= CURDATE()) as total_barosani,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND data_expirare >= CURDATE() AND tier = 'platinum') as platinum_count,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND data_expirare >= CURDATE() AND tier = 'gold') as gold_count,
  (SELECT COUNT(*) FROM barosani WHERE status = 'active' AND data_expirare >= CURDATE() AND tier = 'basic') as basic_count,
  (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
  (
    SELECT
      COALESCE(SUM(
        CASE
          WHEN tier = 'platinum' THEN 100
          WHEN tier = 'gold' THEN 50
          WHEN tier = 'basic' THEN 20
          ELSE 0
        END
      ), 0)
    FROM barosani
    WHERE status = 'active'
    AND data_expirare >= CURDATE()
    AND MONTH(data_inregistrare) = MONTH(CURRENT_DATE())
    AND YEAR(data_inregistrare) = YEAR(CURRENT_DATE())
  ) as monthly_revenue;

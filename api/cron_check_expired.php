<?php
/**
 * Script CRON pentru verificare și marcare barosani expirați
 * Rulează zilnic pentru a actualiza statusurile
 *
 * Adaugă în cron (Linux) sau Task Scheduler (Windows):
 * 0 2 * * * php /path/to/api/cron_check_expired.php
 */

require_once 'config.php';

try {
    $conn = getDBConnection();

    // Marchează barosanii expirați
    $stmt = $conn->prepare("
        UPDATE barosani
        SET status = 'expired'
        WHERE status = 'active'
        AND data_expirare < CURDATE()
    ");

    $stmt->execute();
    $expiredCount = $stmt->rowCount();

    // Log rezultat
    $logMessage = date('Y-m-d H:i:s') . " - Cron check expired: {$expiredCount} barosani marcați ca expirați\n";

    // Scrie în log file
    $logFile = __DIR__ . '/logs/cron.log';
    if (!file_exists(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    file_put_contents($logFile, $logMessage, FILE_APPEND);

    // Output pentru verificare manuală
    echo "✅ Cron job completed successfully!\n";
    echo "📊 Barosani marcați ca expirați: {$expiredCount}\n";
    echo "📅 Data/Ora: " . date('Y-m-d H:i:s') . "\n";

} catch(PDOException $e) {
    $errorMessage = date('Y-m-d H:i:s') . " - ERROR: " . $e->getMessage() . "\n";
    file_put_contents(__DIR__ . '/logs/cron.log', $errorMessage, FILE_APPEND);

    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>

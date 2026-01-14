<?php
/**
 * Expiry Notifications Cron Job
 *
 * Acest script verifică barosanii care urmează să expire și trimite notificări
 * la intervale specifice (30 zile, 7 zile, 1 zi înainte de expirare).
 *
 * Usage:
 * - Cron job: php /path/to/api/cron/check_expiry.php
 * - Manual: accesează direct URL-ul (doar pentru development/testing)
 *
 * Intervals:
 * - 30 zile înainte: Prima notificare
 * - 7 zile înainte: A doua notificare
 * - 1 zi înainte: Notificare urgentă
 */

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/helpers/Logger.php';
require_once dirname(__DIR__) . '/helpers/EmailSender.php';

$logger = new Logger();

// Verifică dacă scriptul rulează din CLI sau web
$isCLI = php_sapi_name() === 'cli';

if (!$isCLI) {
    // Pentru development - permite accesare din browser
    header('Content-Type: application/json');

    // În producție, comentează următoarele 3 linii pentru securitate
    if (!isset($_GET['allow_web_access'])) {
        die(json_encode(['error' => 'Access denied. Use ?allow_web_access=1 for development only.']));
    }
}

$logger->info("Expiry check cron job started");

try {
    // Conectare la database
    $db = getDBConnection();

    // Configurare intervals de notificare (zile înainte de expirare)
    $notificationIntervals = [
        '30days' => 30,
        '7days' => 7,
        '1day' => 1
    ];

    $results = [
        'checked' => 0,
        'notifications_sent' => 0,
        'errors' => []
    ];

    // Iterează prin fiecare interval
    foreach ($notificationIntervals as $type => $days) {
        // Calculează data țintă (data de expirare care se potrivește cu intervalul)
        $targetDate = date('Y-m-d', strtotime("+{$days} days"));

        // Query pentru barosani care expiră în X zile și nu au primit deja notificarea
        $stmt = $db->prepare("
            SELECT b.id, b.nume, b.email, b.data_expirare, b.tier, b.certificat_id
            FROM barosani b
            LEFT JOIN expiry_notifications en
                ON b.id = en.barosan_id
                AND en.notification_type = :notification_type
            WHERE b.status = 'active'
            AND DATE(b.data_expirare) = :target_date
            AND en.id IS NULL
            ORDER BY b.data_expirare ASC
        ");

        $stmt->execute([
            'notification_type' => $type,
            'target_date' => $targetDate
        ]);

        $expiringBarosani = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $results['checked'] += count($expiringBarosani);

        foreach ($expiringBarosani as $barosan) {
            try {
                // Pregătește mesajul de notificare
                $message = generateNotificationMessage($barosan, $days);

                // Log notificarea
                $logger->warning("Expiry notification ({$type}): {$barosan['nume']} expires on {$barosan['data_expirare']}");

                // Încearcă să trimită email (doar dacă EmailSender e configurat)
                $emailSent = false;
                $emailError = null;

                try {
                    // Email sending va fi activat după configurarea SMTP
                    // Deocamdată doar pregătim infrastructura

                    // Uncomment după configurarea SMTP:
                    /*
                    $emailSender = new EmailSender();
                    $emailSent = $emailSender->sendExpiryNotification(
                        $barosan['email'],
                        $barosan['nume'],
                        $barosan['data_expirare'],
                        $days,
                        $barosan['certificat_id']
                    );
                    */

                    // Pentru development: simulează email trimis cu succes
                    if (isset($_GET['simulate_email']) && $_GET['simulate_email'] === '1') {
                        $emailSent = true;
                        $logger->info("Email simulated for {$barosan['email']}");
                    }

                } catch (Exception $emailEx) {
                    $emailError = $emailEx->getMessage();
                    $logger->error("Email sending failed for {$barosan['email']}: " . $emailError);
                }

                // Salvează notificarea în database
                $insertStmt = $db->prepare("
                    INSERT INTO expiry_notifications
                    (barosan_id, notification_type, email_sent, email_error)
                    VALUES (:barosan_id, :notification_type, :email_sent, :email_error)
                ");

                $insertStmt->execute([
                    'barosan_id' => $barosan['id'],
                    'notification_type' => $type,
                    'email_sent' => $emailSent ? 1 : 0,
                    'email_error' => $emailError
                ]);

                $results['notifications_sent']++;

                // Output pentru CLI
                if ($isCLI) {
                    echo "✓ Notification sent: {$barosan['nume']} ({$type}) - Expires: {$barosan['data_expirare']}\n";
                }

            } catch (Exception $e) {
                $error = "Failed to process notification for barosan ID {$barosan['id']}: " . $e->getMessage();
                $results['errors'][] = $error;
                $logger->error($error);

                if ($isCLI) {
                    echo "✗ Error: {$error}\n";
                }
            }
        }
    }

    // Verifică și update status pentru barosani expirați
    $expiredCount = updateExpiredBarosani($db, $logger);
    $results['expired_updated'] = $expiredCount;

    $logger->info("Expiry check completed: {$results['notifications_sent']} notifications sent, {$expiredCount} expired");

    // Output final
    if ($isCLI) {
        echo "\n--- Expiry Check Summary ---\n";
        echo "Checked: {$results['checked']} barosani\n";
        echo "Notifications sent: {$results['notifications_sent']}\n";
        echo "Status updated (expired): {$expiredCount}\n";
        echo "Errors: " . count($results['errors']) . "\n";

        if (!empty($results['errors'])) {
            echo "\nErrors:\n";
            foreach ($results['errors'] as $error) {
                echo "  - {$error}\n";
            }
        }
    } else {
        echo json_encode([
            'success' => true,
            'results' => $results,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT);
    }

} catch (Exception $e) {
    $error = "Expiry check failed: " . $e->getMessage();
    $logger->error($error);

    if ($isCLI) {
        echo "✗ FATAL ERROR: {$error}\n";
        exit(1);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $error
        ]);
    }
}

/**
 * Generează mesajul de notificare pentru barosan
 */
function generateNotificationMessage($barosan, $days) {
    $daysText = $days === 1 ? '1 zi' : "$days zile";

    return "Bună {$barosan['nume']},\n\n" .
           "Certificatul tău de barosan (#{$barosan['certificat_id']}) va expira în {$daysText}!\n" .
           "Data expirare: {$barosan['data_expirare']}\n\n" .
           "Pentru a continua să fii pe Zidul Barosanilor, te rugăm să îți reînnoiești abonamentul.\n\n" .
           "Cu respect,\n" .
           "Echipa Zidul Barosanilor";
}

/**
 * Update status pentru barosanii care au expirat deja
 */
function updateExpiredBarosani($db, $logger) {
    $stmt = $db->prepare("
        UPDATE barosani
        SET status = 'expired'
        WHERE status = 'active'
        AND DATE(data_expirare) < CURDATE()
    ");

    $stmt->execute();
    $count = $stmt->rowCount();

    if ($count > 0) {
        $logger->warning("Updated {$count} barosani to expired status");
    }

    return $count;
}
?>

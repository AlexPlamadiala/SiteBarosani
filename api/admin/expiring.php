<?php
/**
 * Admin Expiring Barosani Endpoint
 *
 * GET - Returnează lista barosanilor care expiră în curând
 * POST - Trigger manual pentru cron job de expiry check
 */

require_once '../config.php';
require_once '../helpers/Logger.php';

$adminId = checkAdminAuth();
$logger = new Logger();

// GET - Lista barosani care expiră
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDBConnection();

        // Intervalul în zile (default 30 zile)
        $days = isset($_GET['days']) ? (int)$_GET['days'] : 30;
        $days = min($days, 90); // Max 90 zile

        // Query barosani care expiră în următoarele X zile
        $stmt = $db->prepare("
            SELECT
                b.id,
                b.nume,
                b.email,
                b.tier,
                b.certificat_id,
                b.data_expirare,
                DATEDIFF(b.data_expirare, CURDATE()) as days_left,
                (
                    SELECT COUNT(*)
                    FROM expiry_notifications en
                    WHERE en.barosan_id = b.id
                ) as notifications_sent
            FROM barosani b
            WHERE b.status = 'active'
            AND b.data_expirare BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL :days DAY)
            ORDER BY b.data_expirare ASC
        ");

        $stmt->execute(['days' => $days]);
        $expiring = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'expiring' => $expiring,
            'total' => count($expiring)
        ]);

    } catch(Exception $e) {
        $logger->error("Failed to get expiring barosani: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

// POST - Trigger manual expiry check
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $logger->info("Manual expiry check triggered by admin ID: {$adminId}");

        // Include și rulează scriptul de cron
        $cronScript = dirname(__DIR__) . '/cron/check_expiry.php';

        if (!file_exists($cronScript)) {
            throw new Exception('Cron script not found');
        }

        // Capturează output-ul scriptului
        ob_start();
        $_GET['allow_web_access'] = '1'; // Permite accesare din web pentru manual trigger
        $_GET['simulate_email'] = '0'; // Nu simula email-uri în trigger manual
        include $cronScript;
        $output = ob_get_clean();

        // Parse JSON output
        $result = json_decode($output, true);

        if ($result && isset($result['success']) && $result['success']) {
            $logger->info("Manual expiry check completed successfully");

            echo json_encode([
                'success' => true,
                'message' => 'Expiry check executed successfully',
                'results' => $result['results'] ?? null
            ]);
        } else {
            throw new Exception('Expiry check failed: ' . ($result['error'] ?? 'Unknown error'));
        }

    } catch(Exception $e) {
        $logger->error("Manual expiry check failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>

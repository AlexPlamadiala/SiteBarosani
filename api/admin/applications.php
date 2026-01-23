<?php
// Start output buffering to capture any unexpected output
ob_start();

// Custom error handler to convert errors to JSON responses
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Shutdown handler to ensure we always output valid JSON
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        // Clear any output
        if (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error: ' . $error['message']]);
    }
});

try {
    require_once '../config.php';
    require_once '../helpers/ChangeTracker.php';

    $tracker = new ChangeTracker();
    $adminId = checkAdminAuth();
    $conn = getDBConnection();

    // Ensure application_history table exists
    $conn->exec("
        CREATE TABLE IF NOT EXISTS application_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            application_id INT NOT NULL,
            action VARCHAR(50) NOT NULL,
            old_status VARCHAR(50),
            new_status VARCHAR(50),
            notes TEXT,
            admin_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_app_id (application_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Init error: ' . $e->getMessage()]);
    exit;
}

// Helper function to log application history
function logApplicationHistory($conn, $appId, $action, $oldStatus, $newStatus, $notes = null, $adminId = null) {
    try {
        $stmt = $conn->prepare("
            INSERT INTO application_history (application_id, action, old_status, new_status, notes, admin_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$appId, $action, $oldStatus, $newStatus, $notes, $adminId]);
    } catch(PDOException $e) {
        error_log("Error logging application history: " . $e->getMessage());
    }
}

// GET - Listare toate cererile sau istoric pentru o cerere specifică
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Check if requesting history for a specific application
        if (isset($_GET['history']) && isset($_GET['id'])) {
            $appId = intval($_GET['id']);

            // First check if this application exists
            $checkStmt = $conn->prepare("SELECT id, code, nume FROM applications WHERE id = ?");
            $checkStmt->execute([$appId]);
            $app = $checkStmt->fetch();

            $stmt = $conn->prepare("
                SELECT h.*, a.username as admin_name
                FROM application_history h
                LEFT JOIN admins a ON h.admin_id = a.id
                WHERE h.application_id = ?
                ORDER BY h.created_at DESC
            ");
            $stmt->execute([$appId]);
            $history = $stmt->fetchAll();

            echo json_encode([
                'success' => true,
                'history' => $history,
                'debug' => [
                    'requested_id' => $appId,
                    'app_exists' => $app ? true : false,
                    'history_count' => count($history)
                ]
            ]);
        } else {
            // Get all applications
            $stmt = $conn->query("
                SELECT *
                FROM applications
                ORDER BY created_at DESC
            ");
            $applications = $stmt->fetchAll();

            // Get history counts for each application
            $historyStmt = $conn->query("
                SELECT application_id, COUNT(*) as history_count
                FROM application_history
                GROUP BY application_id
            ");
            $historyCounts = [];
            while ($row = $historyStmt->fetch()) {
                $historyCounts[$row['application_id']] = $row['history_count'];
            }

            // Add history count to each application
            foreach ($applications as &$app) {
                $app['history_count'] = $historyCounts[$app['id']] ?? 0;
            }

            echo json_encode(['success' => true, 'applications' => $applications]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// PUT - Aprobare cerere (transformă în barosan)
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $inTransaction = false;
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['action']) || !isset($data['id'])) {
            throw new Exception('Date lipsă: action sau id');
        }

        if ($data['action'] === 'approve') {
            // Begin transaction
            $conn->beginTransaction();
            $inTransaction = true;

            // Get application data
            $stmt = $conn->prepare("SELECT * FROM applications WHERE id = ?");
            $stmt->execute([$data['id']]);
            $app = $stmt->fetch();

            if (!$app) {
                throw new Exception('Cerere nu există');
            }

            // Different handling for suprem tier
            if ($app['tier'] === 'suprem') {
                // Check if there's already an active suprem
                $checkStmt = $conn->prepare("
                    SELECT id, nume FROM barosani_suprem
                    WHERE status = 'active' AND data_expirare > NOW()
                    LIMIT 1
                ");
                $checkStmt->execute();
                $activeSuprem = $checkStmt->fetch();

                if ($activeSuprem) {
                    throw new Exception("Nu poți aproba o cerere de Suprem când există deja un Barosan Suprem activ ({$activeSuprem['nume']}). Dezactivează mai întâi supremul actual din tab-ul 'Suprem'.");
                }

                // Suprem goes to barosani_suprem table
                $hours = $app['suprem_hours'] ?? 1;
                $dataStart = date('Y-m-d H:i:s');
                $dataExpirare = date('Y-m-d H:i:s', strtotime("+{$hours} hours"));

                // Determine package name
                $pachet = $hours . 'h';

                $stmt = $conn->prepare("
                    INSERT INTO barosani_suprem
                    (nume, email, revolut_id, motto, poza, link, pachet, suma_platita, data_start, data_expirare, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
                ");

                $stmt->execute([
                    $app['nume'],
                    $app['email'],
                    $app['revolut_id'],
                    $app['motto'],
                    $app['poza'],
                    $app['link'],
                    $pachet,
                    $app['suma'],
                    $dataStart,
                    $dataExpirare
                ]);

                $message = "Cerere aprobată! Barosanul Suprem a fost activat pentru {$hours} ore!";
                $certificatId = 'SUPREM-' . date('Y') . '-' . str_pad($conn->lastInsertId(), 4, '0', STR_PAD_LEFT);

            } else {
                // Regular tiers go to barosani table
                $certificatId = generateCertificatId();
                $dataInregistrare = date('Y-m-d');
                $dataExpirare = date('Y-m-d', strtotime('+1 month'));

                $stmt = $conn->prepare("
                    INSERT INTO barosani
                    (nume, email, revolut_id, motto, tier, poza, link, certificat_id, data_inregistrare, data_expirare, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
                ");

                $stmt->execute([
                    $app['nume'],
                    $app['email'],
                    $app['revolut_id'],
                    $app['motto'],
                    $app['tier'],
                    $app['poza'],
                    $app['link'],
                    $certificatId,
                    $dataInregistrare,
                    $dataExpirare
                ]);

                $message = 'Cerere aprobată și barosan adăugat pe zid!';
            }

            // Update application status
            $oldStatus = $app['status'];
            $stmt = $conn->prepare("UPDATE applications SET status = 'approved' WHERE id = ?");
            $stmt->execute([$data['id']]);

            // Log history
            logApplicationHistory($conn, $data['id'], 'approved', $oldStatus, 'approved', 'Cerere aprobată și barosan adăugat', $adminId);

            $conn->commit();
            $inTransaction = false;

            logAdminAction($adminId, 'approve_application', "Aprobată cerere: {$app['code']} (tier: {$app['tier']})");

            // Notifică SSE
            try {
                if ($app['tier'] === 'suprem') {
                    $tracker->notifyChange('suprem', 'created');
                } else {
                    $tracker->notifyChange('barosani', 'created');
                }
                $tracker->notifyChange('applications', 'approved');
            } catch(Exception $e) {
                // Silent fail pentru SSE
            }

            // Send approval email (optional)
            try {
                if (file_exists('../helpers/EmailSender.php')) {
                    require_once '../helpers/EmailSender.php';
                    $emailSender = new EmailSender();
                    $barosanData = [
                        'nume' => $app['nume'],
                        'email' => $app['email'],
                        'tier' => $app['tier'],
                        'certificat_id' => $certificatId
                    ];
                    $emailSender->sendApprovalEmail($barosanData);
                }
            } catch(Exception $e) {
                // Silent fail pentru email
                error_log("Email error: " . $e->getMessage());
            }

            echo json_encode([
                'success' => true,
                'message' => $message,
                'certificatId' => $certificatId
            ]);

        } elseif ($data['action'] === 'reject') {
            // Get old status first
            $stmt = $conn->prepare("SELECT status FROM applications WHERE id = ?");
            $stmt->execute([$data['id']]);
            $oldStatus = $stmt->fetchColumn();

            $stmt = $conn->prepare("
                UPDATE applications
                SET status = 'rejected', admin_notes = ?
                WHERE id = ?
            ");
            $stmt->execute([$data['notes'] ?? 'Respinsă', $data['id']]);

            // Log history
            logApplicationHistory($conn, $data['id'], 'rejected', $oldStatus, 'rejected', $data['notes'] ?? 'Cerere respinsă', $adminId);

            logAdminAction($adminId, 'reject_application', "Respinsă cerere ID: {$data['id']}");

            try {
                $tracker->notifyChange('applications', 'rejected');
            } catch(Exception $e) {}

            echo json_encode(['success' => true, 'message' => 'Cerere respinsă']);

        } elseif ($data['action'] === 'payment_confirmed') {
            // Actualizează status și salvează dovada plății (dacă există)
            $paymentProof = $data['payment_proof'] ?? null;

            // Get old status first
            $stmt = $conn->prepare("SELECT status FROM applications WHERE id = ?");
            $stmt->execute([$data['id']]);
            $oldStatus = $stmt->fetchColumn();

            // Update status first
            $stmt = $conn->prepare("UPDATE applications SET status = 'payment_confirmed' WHERE id = ?");
            $stmt->execute([$data['id']]);

            // Try to update payment_proof if provided (column might not exist yet)
            if ($paymentProof) {
                try {
                    $stmt = $conn->prepare("UPDATE applications SET payment_proof = ? WHERE id = ?");
                    $stmt->execute([$paymentProof, $data['id']]);
                } catch(PDOException $e) {
                    // Column might not exist, log but continue
                    error_log("payment_proof column might not exist: " . $e->getMessage());
                }
            }

            // Log history
            logApplicationHistory($conn, $data['id'], 'payment_confirmed', $oldStatus, 'payment_confirmed', 'Plata a fost confirmată', $adminId);

            logAdminAction($adminId, 'confirm_payment', "Confirmat plata pentru cerere ID: {$data['id']}");

            try {
                $tracker->notifyChange('applications', 'payment_confirmed');
            } catch(Exception $e) {}

            echo json_encode(['success' => true, 'message' => 'Plată confirmată']);

        } else {
            throw new Exception('Acțiune necunoscută: ' . $data['action']);
        }

    } catch(Exception $e) {
        if ($inTransaction) {
            $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// DELETE - Ștergere cerere
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception('ID lipsă');
        }

        $stmt = $conn->prepare("DELETE FROM applications WHERE id = ?");
        $stmt->execute([$id]);

        logAdminAction($adminId, 'delete_application', "Ștearsă cerere ID: {$id}");

        // Notifică SSE că s-a șters cererea
        $tracker->notifyChange('applications', 'deleted');

        echo json_encode(['success' => true, 'message' => 'Cerere ștearsă']);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    // Unknown request method
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

// Flush output buffer
if (ob_get_level() > 0) {
    ob_end_flush();
}
?>

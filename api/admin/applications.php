<?php
require_once '../config.php';
require_once '../helpers/ChangeTracker.php';

$tracker = new ChangeTracker();
$adminId = checkAdminAuth();
$conn = getDBConnection();

// GET - Listare toate cererile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("
            SELECT *
            FROM applications
            ORDER BY created_at DESC
        ");
        $applications = $stmt->fetchAll();

        echo json_encode(['success' => true, 'applications' => $applications]);
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

            // Generare certificat ID
            $certificatId = generateCertificatId();
            $dataInregistrare = date('Y-m-d');
            $dataExpirare = date('Y-m-d', strtotime('+1 month'));

            // Get application data
            $stmt = $conn->prepare("SELECT * FROM applications WHERE id = ?");
            $stmt->execute([$data['id']]);
            $app = $stmt->fetch();

            if (!$app) {
                throw new Exception('Cerere nu există');
            }

            // Insert în barosani
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

            // Update application status
            $stmt = $conn->prepare("UPDATE applications SET status = 'approved' WHERE id = ?");
            $stmt->execute([$data['id']]);

            $conn->commit();
            $inTransaction = false;

            logAdminAction($adminId, 'approve_application', "Aprobată cerere: {$app['code']}");

            // Notifică SSE că s-a creat un barosan nou ȘI s-a modificat cererea
            try {
                $tracker->notifyChange('barosani', 'created');
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
                        'certificat_id' => $certificatId,
                        'data_inregistrare' => $dataInregistrare,
                        'data_expirare' => $dataExpirare
                    ];
                    $emailSender->sendApprovalEmail($barosanData);
                }
            } catch(Exception $e) {
                // Silent fail pentru email
                error_log("Email error: " . $e->getMessage());
            }

            echo json_encode([
                'success' => true,
                'message' => 'Cerere aprobată și barosan adăugat pe zid!',
                'certificatId' => $certificatId
            ]);

        } elseif ($data['action'] === 'reject') {
            $stmt = $conn->prepare("
                UPDATE applications
                SET status = 'rejected', admin_notes = ?
                WHERE id = ?
            ");
            $stmt->execute([$data['notes'] ?? 'Respinsă', $data['id']]);

            logAdminAction($adminId, 'reject_application', "Respinsă cerere ID: {$data['id']}");

            try {
                $tracker->notifyChange('applications', 'rejected');
            } catch(Exception $e) {}

            echo json_encode(['success' => true, 'message' => 'Cerere respinsă']);

        } elseif ($data['action'] === 'payment_confirmed') {
            // Actualizează status și salvează dovada plății (dacă există)
            $paymentProof = $data['payment_proof'] ?? null;

            if ($paymentProof) {
                $stmt = $conn->prepare("UPDATE applications SET status = 'payment_confirmed', payment_proof = ? WHERE id = ?");
                $stmt->execute([$paymentProof, $data['id']]);
            } else {
                $stmt = $conn->prepare("UPDATE applications SET status = 'payment_confirmed' WHERE id = ?");
                $stmt->execute([$data['id']]);
            }

            logAdminAction($adminId, 'confirm_payment', "Confirmat plata pentru cerere ID: {$data['id']}");

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
}
?>

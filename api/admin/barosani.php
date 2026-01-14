<?php
require_once '../config.php';
require_once '../helpers/ChangeTracker.php';

$tracker = new ChangeTracker();
$adminId = checkAdminAuth();
$conn = getDBConnection();

// GET - Listare toți barosanii (inclusiv inactivi)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("
            SELECT
                id, nume, email, revolut_id, motto, tier, poza, link,
                certificat_id, data_inregistrare, data_expirare, status,
                created_at, updated_at
            FROM barosani
            ORDER BY created_at DESC
        ");
        $barosani = $stmt->fetchAll();

        echo json_encode(['success' => true, 'barosani' => $barosani]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// POST - Adaugă barosan nou
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        $certificatId = generateCertificatId();
        $dataInregistrare = date('Y-m-d');
        $dataExpirare = date('Y-m-d', strtotime('+1 month'));

        $stmt = $conn->prepare("
            INSERT INTO barosani
            (nume, email, revolut_id, motto, tier, poza, link, certificat_id, data_inregistrare, data_expirare, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ");

        $stmt->execute([
            sanitizeInput($data['nume']),
            filter_var($data['email'], FILTER_SANITIZE_EMAIL),
            sanitizeInput($data['revolutId']),
            sanitizeInput($data['motto']),
            $data['tier'],
            $data['poza'] ?? null,
            $data['link'] ?? null,
            $certificatId,
            $dataInregistrare,
            $dataExpirare
        ]);

        logAdminAction($adminId, 'add_barosan', "Adăugat barosan: {$data['nume']}");

        // Notifică SSE că s-a creat un barosan nou
        $tracker->notifyChange('barosani', 'created');

        echo json_encode(['success' => true, 'message' => 'Barosan adăugat cu succes']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// PUT - Actualizare barosan
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        $stmt = $conn->prepare("
            UPDATE barosani
            SET nume = ?, email = ?, revolut_id = ?, motto = ?, tier = ?,
                poza = ?, link = ?, data_expirare = ?, status = ?
            WHERE id = ?
        ");

        $stmt->execute([
            sanitizeInput($data['nume']),
            filter_var($data['email'], FILTER_SANITIZE_EMAIL),
            sanitizeInput($data['revolutId']),
            sanitizeInput($data['motto']),
            $data['tier'],
            $data['poza'] ?? null,
            $data['link'] ?? null,
            $data['dataExpirare'],
            $data['status'],
            $data['id']
        ]);

        logAdminAction($adminId, 'update_barosan', "Actualizat barosan ID: {$data['id']}");

        // Notifică SSE că s-a actualizat barosanul
        $tracker->notifyChange('barosani', 'updated');

        echo json_encode(['success' => true, 'message' => 'Barosan actualizat cu succes']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// DELETE - Ștergere barosan
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception('ID lipsă');
        }

        $stmt = $conn->prepare("DELETE FROM barosani WHERE id = ?");
        $stmt->execute([$id]);

        logAdminAction($adminId, 'delete_barosan', "Șters barosan ID: {$id}");

        // Notifică SSE că s-a șters barosanul - ACESTA E CAZUL TĂU!
        $tracker->notifyChange('barosani', 'deleted');

        echo json_encode(['success' => true, 'message' => 'Barosan șters cu succes']);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>

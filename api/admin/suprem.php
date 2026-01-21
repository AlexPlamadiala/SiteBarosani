<?php
// Start output buffering
ob_start();

try {
    require_once '../config.php';
    require_once '../helpers/ChangeTracker.php';

    $tracker = new ChangeTracker();
    $adminId = checkAdminAuth();
    $conn = getDBConnection();
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Init error: ' . $e->getMessage()]);
    exit;
}

// DELETE - Dezactivare suprem
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id'])) {
            throw new Exception('ID lipsă');
        }

        // Update status to 'deactivated' instead of deleting
        $stmt = $conn->prepare("UPDATE barosani_suprem SET status = 'deactivated' WHERE id = ?");
        $stmt->execute([$data['id']]);

        logAdminAction($adminId, 'deactivate_suprem', "Dezactivat Barosanul Suprem ID: {$data['id']}");

        // Notify SSE about suprem change
        try {
            $tracker->notifyChange('suprem', 'deactivated');
        } catch(Exception $e) {}

        echo json_encode(['success' => true, 'message' => 'Barosanul Suprem a fost dezactivat']);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// PUT - Update suprem (prelungire, modificare)
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['id'])) {
            throw new Exception('ID lipsă');
        }

        // Update suprem data
        $stmt = $conn->prepare("
            UPDATE barosani_suprem
            SET nume = ?, motto = ?, poza = ?, link = ?, data_expirare = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['nume'] ?? null,
            $data['motto'] ?? null,
            $data['poza'] ?? null,
            $data['link'] ?? null,
            $data['dataExpirare'] ?? null,
            $data['id']
        ]);

        logAdminAction($adminId, 'update_suprem', "Actualizat Barosanul Suprem ID: {$data['id']}");

        // Notify SSE
        try {
            $tracker->notifyChange('suprem', 'updated');
        } catch(Exception $e) {}

        echo json_encode(['success' => true, 'message' => 'Barosanul Suprem a fost actualizat']);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

// Flush output buffer
if (ob_get_level() > 0) {
    ob_end_flush();
}
?>

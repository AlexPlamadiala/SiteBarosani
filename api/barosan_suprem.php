<?php
require_once 'config.php';

// GET - returnează barosanul suprem activ (dacă există)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = getDBConnection();

        // Mai întâi, marchează ca expirate cele care au trecut de data_expirare
        $updateStmt = $conn->prepare("
            UPDATE barosani_suprem
            SET status = 'expired'
            WHERE status = 'active' AND data_expirare < NOW()
        ");
        $updateStmt->execute();

        // Apoi preia barosanul suprem activ
        $stmt = $conn->prepare("
            SELECT
                id,
                nume,
                motto,
                poza,
                link,
                pachet,
                suma_platita as sumaPlatita,
                data_start as dataStart,
                data_expirare as dataExpirare,
                TIMESTAMPDIFF(SECOND, NOW(), data_expirare) as secondsRemaining,
                status
            FROM barosani_suprem
            WHERE status = 'active'
            AND data_expirare > NOW()
            ORDER BY data_expirare DESC
            LIMIT 1
        ");

        $stmt->execute();
        $suprem = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($suprem) {
            // Există un barosan suprem activ
            echo json_encode([
                'success' => true,
                'available' => false,
                'suprem' => $suprem
            ]);
        } else {
            // Nu există - locul este liber
            echo json_encode([
                'success' => true,
                'available' => true,
                'suprem' => null
            ]);
        }

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Eroare la preluarea datelor: ' . $e->getMessage()
        ]);
    }
}
?>

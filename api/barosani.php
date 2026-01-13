<?php
require_once 'config.php';

// GET - returnează toți barosanii activi pentru frontend
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = getDBConnection();

        $stmt = $conn->prepare("
            SELECT
                id,
                nume,
                motto,
                tier,
                poza,
                link,
                certificat_id as certificatId,
                DATE_FORMAT(data_inregistrare, '%Y-%m-%d') as dataInregistrare
            FROM barosani
            WHERE status = 'active'
            ORDER BY
                FIELD(tier, 'platinum', 'gold', 'basic'),
                data_inregistrare DESC
        ");

        $stmt->execute();
        $barosani = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'barosani' => $barosani
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Eroare la preluarea datelor: ' . $e->getMessage()
        ]);
    }
}
?>

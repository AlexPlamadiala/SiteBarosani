<?php
require_once 'config.php';
require_once 'helpers/ChangeTracker.php';

$tracker = new ChangeTracker();

// POST - creează o cerere nouă
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Apply rate limiting
    applyRateLimit('applications_create');

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        // Validare
        if (empty($data['nume']) || empty($data['email']) || empty($data['revolutId']) || empty($data['motto'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Date incomplete'
            ]);
            exit();
        }

        // Sanitize
        $nume = sanitizeInput($data['nume']);
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $revolutId = sanitizeInput($data['revolutId']);
        $motto = sanitizeInput($data['motto']);
        $tier = in_array($data['tier'], ['basic', 'gold', 'platinum']) ? $data['tier'] : 'basic';
        $poza = !empty($data['poza']) ? filter_var($data['poza'], FILTER_SANITIZE_URL) : null;
        $link = !empty($data['link']) ? filter_var($data['link'], FILTER_SANITIZE_URL) : null;

        // Preț bazat pe tier
        $prices = ['basic' => 20, 'gold' => 50, 'platinum' => 100];
        $suma = $prices[$tier];

        // Generare cod unic
        $year = date('Y');
        $conn = getDBConnection();
        $stmt = $conn->query("SELECT COUNT(*) as count FROM applications");
        $result = $stmt->fetch();
        $nextNumber = $result['count'] + 1;
        $code = 'CP-' . $year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        // Insert în DB
        $stmt = $conn->prepare("
            INSERT INTO applications
            (code, nume, email, revolut_id, motto, tier, poza, link, suma, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        ");

        $stmt->execute([
            $code, $nume, $email, $revolutId, $motto, $tier, $poza, $link, $suma
        ]);

        // Notifică SSE că s-a creat o cerere nouă
        $tracker->notifyChange('applications', 'created');

        echo json_encode([
            'success' => true,
            'code' => $code,
            'message' => 'Cerere înregistrată cu succes'
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Eroare la salvarea cererii: ' . $e->getMessage()
        ]);
    }
}
?>

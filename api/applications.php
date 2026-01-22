<?php
// Set JSON header și disable error display
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

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
        $tier = in_array($data['tier'], ['basic', 'gold', 'platinum', 'suprem']) ? $data['tier'] : 'basic';
        $poza = !empty($data['poza']) ? filter_var($data['poza'], FILTER_SANITIZE_URL) : null;
        $link = !empty($data['link']) ? filter_var($data['link'], FILTER_SANITIZE_URL) : null;
        $supremHours = ($tier === 'suprem' && !empty($data['supremHours'])) ? (int)$data['supremHours'] : null;

        // Upgrade parameters
        $isUpgrade = !empty($data['isUpgrade']);
        $existingBarosanId = $isUpgrade && !empty($data['existingBarosanId']) ? (int)$data['existingBarosanId'] : null;
        $previousTier = $isUpgrade && !empty($data['previousTier']) ? $data['previousTier'] : null;

        // Preț bazat pe tier
        $prices = ['basic' => 0, 'gold' => 49, 'platinum' => 149, 'suprem' => 50];

        if ($tier === 'suprem' && $supremHours) {
            // Calcul preț suprem cu discount
            $basePrice = $supremHours * 50;
            $discount = 0;
            if ($supremHours >= 24) $discount = 20;
            elseif ($supremHours >= 12) $discount = 10;
            $suma = round($basePrice * (1 - $discount / 100));
        } else {
            $suma = $prices[$tier];
            // For upgrades, calculate the price difference
            if ($isUpgrade && $previousTier && $tier !== 'suprem') {
                $previousPrice = $prices[$previousTier] ?? 0;
                $suma = max(0, $suma - $previousPrice);
            }
        }

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
            (code, nume, email, revolut_id, motto, tier, suprem_hours, poza, link, suma, status, is_upgrade, existing_barosan_id, previous_tier)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
        ");

        $stmt->execute([
            $code, $nume, $email, $revolutId, $motto, $tier, $supremHours, $poza, $link, $suma,
            $isUpgrade ? 1 : 0, $existingBarosanId, $previousTier
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
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Eroare generală: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Metodă HTTP nepermisă'
    ]);
}
?>

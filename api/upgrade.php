<?php
require_once 'config.php';
require_once 'helpers/EmailSender.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * GET /api/upgrade.php?action=check&email=xxx
 * Check if email exists and get barosan info for upgrade
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'check') {
        $email = filter_var($_GET['email'] ?? '', FILTER_VALIDATE_EMAIL);

        if (!$email) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email invalid']);
            exit();
        }

        try {
            $conn = getDBConnection();

            $stmt = $conn->prepare("
                SELECT id, nume, email, tier, poza, certificat_id, data_inregistrare, status
                FROM barosani
                WHERE email = ? AND status = 'active'
                LIMIT 1
            ");
            $stmt->execute([$email]);
            $barosan = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($barosan) {
                echo json_encode([
                    'success' => true,
                    'exists' => true,
                    'barosan' => [
                        'id' => $barosan['id'],
                        'nume' => $barosan['nume'],
                        'tier' => $barosan['tier'],
                        'poza' => $barosan['poza'],
                        'certificatId' => $barosan['certificat_id'],
                        'dataInregistrare' => $barosan['data_inregistrare']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'exists' => false
                ]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Eroare la verificare: ' . $e->getMessage()]);
        }
        exit();
    }

    if ($action === 'verify') {
        $token = $_GET['token'] ?? '';

        if (empty($token)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Token lipsă']);
            exit();
        }

        try {
            $conn = getDBConnection();

            // Check if token is valid and not expired
            $stmt = $conn->prepare("
                SELECT vt.*, b.id as barosan_id, b.nume, b.email, b.tier, b.poza, b.certificat_id
                FROM verification_tokens vt
                JOIN barosani b ON vt.barosan_id = b.id
                WHERE vt.token = ?
                AND vt.used = 0
                AND vt.expires_at > NOW()
                AND vt.type = 'upgrade'
            ");
            $stmt->execute([$token]);
            $verification = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($verification) {
                echo json_encode([
                    'success' => true,
                    'valid' => true,
                    'barosan' => [
                        'id' => $verification['barosan_id'],
                        'nume' => $verification['nume'],
                        'email' => $verification['email'],
                        'tier' => $verification['tier'],
                        'poza' => $verification['poza'],
                        'certificatId' => $verification['certificat_id']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'valid' => false,
                    'error' => 'Token invalid sau expirat'
                ]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Eroare la verificare']);
        }
        exit();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Acțiune necunoscută']);
    exit();
}

/**
 * POST /api/upgrade.php
 * Actions: send_verification, process_upgrade
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'send_verification') {
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);

        if (!$email) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email invalid']);
            exit();
        }

        try {
            $conn = getDBConnection();

            // Check if barosan exists
            $stmt = $conn->prepare("SELECT id, nume FROM barosani WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $barosan = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$barosan) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Nu există niciun barosan activ cu acest email'
                ]);
                exit();
            }

            // Generate verification token
            $token = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Delete old unused tokens for this email
            $stmt = $conn->prepare("DELETE FROM verification_tokens WHERE email = ? AND used = 0");
            $stmt->execute([$email]);

            // Insert new token
            $stmt = $conn->prepare("
                INSERT INTO verification_tokens (email, token, type, expires_at, barosan_id)
                VALUES (?, ?, 'upgrade', ?, ?)
            ");
            $stmt->execute([$email, $token, $expiresAt, $barosan['id']]);

            // Send verification email
            $verificationLink = "http://localhost:5173/upgrade?token=" . $token;

            $emailSender = new EmailSender();
            $emailSent = $emailSender->sendUpgradeVerification(
                $email,
                $barosan['nume'],
                $verificationLink,
                $expiresAt
            );

            if ($emailSent) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Email de verificare trimis cu succes'
                ]);
            } else {
                // For development, return the token directly
                echo json_encode([
                    'success' => true,
                    'message' => 'Link de verificare generat',
                    'dev_token' => $token,
                    'dev_link' => $verificationLink
                ]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Eroare: ' . $e->getMessage()]);
        }
        exit();
    }

    if ($action === 'process_upgrade') {
        $token = $input['token'] ?? '';
        $newTier = $input['newTier'] ?? '';

        if (empty($token) || empty($newTier)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Date incomplete']);
            exit();
        }

        if (!in_array($newTier, ['gold', 'platinum', 'suprem'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Tier invalid']);
            exit();
        }

        try {
            $conn = getDBConnection();
            $conn->beginTransaction();

            // Verify token
            $stmt = $conn->prepare("
                SELECT vt.*, b.id as barosan_id, b.tier as current_tier, b.tier_history
                FROM verification_tokens vt
                JOIN barosani b ON vt.barosan_id = b.id
                WHERE vt.token = ?
                AND vt.used = 0
                AND vt.expires_at > NOW()
                AND vt.type = 'upgrade'
            ");
            $stmt->execute([$token]);
            $verification = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$verification) {
                $conn->rollBack();
                echo json_encode(['success' => false, 'error' => 'Token invalid sau expirat']);
                exit();
            }

            // Validate tier upgrade (can't downgrade)
            $tierOrder = ['basic' => 1, 'gold' => 2, 'platinum' => 3, 'suprem' => 4];
            $currentTierOrder = $tierOrder[$verification['current_tier']] ?? 0;
            $newTierOrder = $tierOrder[$newTier] ?? 0;

            if ($newTierOrder <= $currentTierOrder) {
                $conn->rollBack();
                echo json_encode([
                    'success' => false,
                    'error' => 'Poți doar să faci upgrade la un tier superior'
                ]);
                exit();
            }

            // Update tier history
            $tierHistory = json_decode($verification['tier_history'] ?? '[]', true);
            $tierHistory[] = [
                'tier' => $verification['current_tier'],
                'date' => date('Y-m-d H:i:s'),
                'action' => 'upgraded_from'
            ];

            // Mark token as used
            $stmt = $conn->prepare("UPDATE verification_tokens SET used = 1 WHERE id = ?");
            $stmt->execute([$verification['id']]);

            // Note: The actual tier update happens when the application is approved
            // Here we create an upgrade application

            $conn->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Verificare reușită. Poți continua cu upgrade-ul.',
                'barosanId' => $verification['barosan_id'],
                'currentTier' => $verification['current_tier']
            ]);

        } catch (PDOException $e) {
            $conn->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Eroare: ' . $e->getMessage()]);
        }
        exit();
    }

    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Acțiune necunoscută']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Metodă nepermisă']);
?>

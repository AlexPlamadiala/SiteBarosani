<?php
// Configurare conexiune bază de date
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // XAMPP default nu are parolă
define('DB_NAME', 'zid_barosani');

// Timezone
date_default_timezone_set('Europe/Bucharest');

// CORS headers pentru React
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexiune database
function getDBConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $conn;
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Eroare conexiune bază de date: ' . $e->getMessage()]);
        exit();
    }
}

// Funcție pentru verificare admin session
function checkAdminAuth() {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    return $_SESSION['admin_id'];
}

// Funcție pentru log admin actions
function logAdminAction($userId, $action, $description = null) {
    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("INSERT INTO admin_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $action, $description, $_SERVER['REMOTE_ADDR']]);
    } catch(PDOException $e) {
        // Silent fail pentru logs
    }
}

// Funcție pentru generare certificat ID
function generateCertificatId() {
    $year = date('Y');
    $conn = getDBConnection();
    $stmt = $conn->query("SELECT COUNT(*) as count FROM barosani");
    $result = $stmt->fetch();
    $nextNumber = $result['count'] + 1;
    return 'BRS-' . $year . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
}

// Funcție pentru sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>

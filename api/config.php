<?php
// Load environment variables
require_once __DIR__ . '/helpers/EnvLoader.php';
EnvLoader::load();

// Load helpers
require_once __DIR__ . '/helpers/RateLimiter.php';

// Configurare conexiune bază de date din .env
define('DB_HOST', EnvLoader::get('DB_HOST', 'localhost'));
define('DB_USER', EnvLoader::get('DB_USER', 'root'));
define('DB_PASS', EnvLoader::get('DB_PASS', ''));
define('DB_NAME', EnvLoader::get('DB_NAME', 'zid_barosani'));

// Site URLs
define('SITE_URL', EnvLoader::get('SITE_URL', 'http://localhost:5173'));
define('API_URL', EnvLoader::get('API_URL', 'http://localhost/SiteBarosani/api'));
define('ADMIN_URL', EnvLoader::get('ADMIN_URL', 'http://localhost/SiteBarosani/admin'));

// Timezone
date_default_timezone_set('Europe/Bucharest');

// Detect if running over HTTPS
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

// Production mode detection
$isProduction = EnvLoader::get('APP_DEBUG', 'true') === 'false';

// Session configuration - must be set before session_start()
if (session_status() === PHP_SESSION_NONE) {
    // Configure session cookie with appropriate security flags
    session_set_cookie_params([
        'lifetime' => 86400, // 24 hours
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps, // Auto-detect HTTPS
        'httponly' => true,
        'samesite' => $isHttps ? 'Strict' : 'Lax' // Strict when HTTPS is available
    ]);
}

// CORS headers pentru React (din .env)
header('Access-Control-Allow-Origin: ' . SITE_URL);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Content Security Policy - allows resources from same origin and configured URLs
$cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for React
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: " . SITE_URL,
    "connect-src 'self' " . SITE_URL . " " . API_URL,
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'"
];
header('Content-Security-Policy: ' . implode('; ', $cspDirectives));

// HSTS header for HTTPS connections
if ($isHttps) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

// Cache control for API responses (no caching by default)
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

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
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
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

// Funcție pentru generare certificat ID unic
function generateCertificatId() {
    $year = date('Y');
    $conn = getDBConnection();
    $prefix = 'BRS-' . $year . '-';

    // Find the highest existing number for this year
    $stmt = $conn->prepare("
        SELECT certificat_id FROM barosani
        WHERE certificat_id LIKE ?
        ORDER BY certificat_id DESC
        LIMIT 1
    ");
    $stmt->execute([$prefix . '%']);
    $result = $stmt->fetch();

    if ($result && preg_match('/BRS-\d{4}-(\d+)/', $result['certificat_id'], $matches)) {
        $nextNumber = intval($matches[1]) + 1;
    } else {
        $nextNumber = 1;
    }

    // Generate ID and verify it's unique (in case of concurrent inserts)
    $newId = $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

    // Check if it exists, if so increment until we find a free one
    $checkStmt = $conn->prepare("SELECT id FROM barosani WHERE certificat_id = ?");
    while (true) {
        $checkStmt->execute([$newId]);
        if (!$checkStmt->fetch()) {
            break; // ID is unique
        }
        $nextNumber++;
        $newId = $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    return $newId;
}

// Funcție pentru sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Funcție pentru aplicare rate limiting
function applyRateLimit($endpoint = 'global') {
    $requestsLimit = (int)EnvLoader::get('RATE_LIMIT_REQUESTS', 100);
    $timeWindow = (int)EnvLoader::get('RATE_LIMIT_WINDOW', 3600);

    $rateLimiter = new RateLimiter($requestsLimit, $timeWindow);
    $rateLimiter->check($endpoint);

    // Add rate limit headers
    $remaining = $rateLimiter->getRemaining($endpoint);
    header('X-RateLimit-Limit: ' . $requestsLimit);
    header('X-RateLimit-Remaining: ' . $remaining);
}
?>

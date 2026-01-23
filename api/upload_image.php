<?php
/**
 * Public Image Upload Endpoint
 *
 * Acest endpoint permite upload-ul de imagini de către utilizatori
 * pentru cereri de înscriere ca barosani.
 */

require_once 'config.php';
require_once 'helpers/ImageUploader.php';
require_once 'helpers/Logger.php';

// JSON & CORS headers - use same as config.php
header('Content-Type: application/json');
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost', 'http://127.0.0.1'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Disable error display
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit();
}

// Apply rate limiting
applyRateLimit('image_upload');

$logger = new Logger();

try {
    // Check if file was uploaded
    if (!isset($_FILES['image'])) {
        throw new Exception('Niciun fișier nu a fost uploadat');
    }

    $file = $_FILES['image'];

    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Eroare la upload: ' . $file['error']);
    }

    // Upload image
    $uploader = new ImageUploader();
    $imageUrl = $uploader->upload($file);

    $logger->info("Image uploaded successfully: {$imageUrl}");

    echo json_encode([
        'success' => true,
        'url' => $imageUrl,
        'message' => 'Imagine uploadată cu succes'
    ]);

} catch (Exception $e) {
    $logger->error("Image upload failed: " . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

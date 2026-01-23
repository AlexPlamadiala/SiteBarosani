<?php
/**
 * Public Image Upload Endpoint
 */

// Error handling - catch everything
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set JSON header first
header('Content-Type: application/json; charset=utf-8');

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['image'])) {
        throw new Exception('Niciun fișier nu a fost uploadat');
    }

    $file = $_FILES['image'];

    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'Fișierul depășește limita din php.ini',
            UPLOAD_ERR_FORM_SIZE => 'Fișierul depășește limita din formular',
            UPLOAD_ERR_PARTIAL => 'Fișierul a fost uploadat parțial',
            UPLOAD_ERR_NO_FILE => 'Niciun fișier nu a fost uploadat',
            UPLOAD_ERR_NO_TMP_DIR => 'Lipsește directorul temporar',
            UPLOAD_ERR_CANT_WRITE => 'Nu s-a putut scrie pe disc',
            UPLOAD_ERR_EXTENSION => 'Upload oprit de o extensie PHP'
        ];
        throw new Exception($errorMessages[$file['error']] ?? 'Eroare upload: ' . $file['error']);
    }

    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('Fișierul este prea mare (max 5MB)');
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('Tipul fișierului nu este permis (doar JPG, PNG, WEBP)');
    }

    // Setup upload directory
    $uploadDir = __DIR__ . '/uploads/';
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Nu s-a putut crea directorul uploads');
        }
    }

    // Generate unique filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
        $extension = 'jpg'; // default
    }
    $filename = 'img_' . uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;

    // Try to resize image if GD is available
    if (extension_loaded('gd')) {
        $resized = resizeAndSaveImage($file['tmp_name'], $filepath, $mimeType);
        if (!$resized) {
            // Fallback to simple move
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                throw new Exception('Nu s-a putut salva imaginea');
            }
        }
    } else {
        // No GD, just move the file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Nu s-a putut salva imaginea');
        }
    }

    // Return success with URL
    echo json_encode([
        'success' => true,
        'url' => '/api/uploads/' . $filename,
        'message' => 'Imagine uploadată cu succes'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

/**
 * Resize image to max dimensions and save
 */
function resizeAndSaveImage($source, $destination, $mimeType) {
    $maxWidth = 800;
    $maxHeight = 800;

    try {
        // Get original dimensions
        $imageInfo = getimagesize($source);
        if (!$imageInfo) return false;

        $width = $imageInfo[0];
        $height = $imageInfo[1];

        // Calculate new dimensions
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        if ($ratio >= 1) {
            // Image is smaller than max, just copy it
            $newWidth = $width;
            $newHeight = $height;
        } else {
            $newWidth = (int)($width * $ratio);
            $newHeight = (int)($height * $ratio);
        }

        // Create image resource
        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                $imageResource = imagecreatefromjpeg($source);
                break;
            case 'image/png':
                $imageResource = imagecreatefrompng($source);
                break;
            case 'image/webp':
                $imageResource = imagecreatefromwebp($source);
                break;
            default:
                return false;
        }

        if (!$imageResource) return false;

        // Create new image
        $newImage = imagecreatetruecolor($newWidth, $newHeight);
        if (!$newImage) {
            imagedestroy($imageResource);
            return false;
        }

        // Preserve transparency for PNG
        if ($mimeType === 'image/png') {
            imagealphablending($newImage, false);
            imagesavealpha($newImage, true);
        }

        // Resize
        imagecopyresampled(
            $newImage, $imageResource,
            0, 0, 0, 0,
            $newWidth, $newHeight,
            $width, $height
        );

        // Save based on type
        $saved = false;
        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                $saved = imagejpeg($newImage, $destination, 85);
                break;
            case 'image/png':
                $saved = imagepng($newImage, $destination, 8);
                break;
            case 'image/webp':
                $saved = imagewebp($newImage, $destination, 85);
                break;
        }

        // Free memory
        imagedestroy($imageResource);
        imagedestroy($newImage);

        return $saved;
    } catch (Exception $e) {
        return false;
    }
}
?>

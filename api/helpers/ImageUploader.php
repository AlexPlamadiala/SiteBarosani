<?php
/**
 * Image Uploader
 * Handles image upload, validation, and optimization
 */
class ImageUploader {
    private $uploadDir;
    private $maxFileSize = 5242880; // 5MB
    private $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    private $maxWidth = 800;
    private $maxHeight = 800;

    public function __construct() {
        $this->uploadDir = __DIR__ . '/../uploads/';

        // Create upload directory if doesn't exist
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Upload and process image
     */
    public function upload($file) {
        // Validate
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Eroare la upload');
        }

        if ($file['size'] > $this->maxFileSize) {
            throw new Exception('Fișierul este prea mare (max 5MB)');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedTypes)) {
            throw new Exception('Tipul fișierului nu este permis (doar JPG, PNG, WEBP)');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_', true) . '.' . $extension;
        $filepath = $this->uploadDir . $filename;

        // Resize and optimize image
        $this->resizeImage($file['tmp_name'], $filepath, $mimeType);

        // Return relative URL
        return '/api/uploads/' . $filename;
    }

    /**
     * Resize image to max dimensions
     */
    private function resizeImage($source, $destination, $mimeType) {
        // Get original dimensions
        list($width, $height) = getimagesize($source);

        // Calculate new dimensions
        $ratio = min($this->maxWidth / $width, $this->maxHeight / $height);

        if ($ratio < 1) {
            $newWidth = (int)($width * $ratio);
            $newHeight = (int)($height * $ratio);
        } else {
            $newWidth = $width;
            $newHeight = $height;
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
                throw new Exception('Tip imagine invalid');
        }

        // Create new image
        $newImage = imagecreatetruecolor($newWidth, $newHeight);

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

        // Save
        switch ($mimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                imagejpeg($newImage, $destination, 85);
                break;
            case 'image/png':
                imagepng($newImage, $destination, 8);
                break;
            case 'image/webp':
                imagewebp($newImage, $destination, 85);
                break;
        }

        // Free memory
        imagedestroy($imageResource);
        imagedestroy($newImage);
    }

    /**
     * Delete image file
     */
    public function delete($imageUrl) {
        $filename = basename($imageUrl);
        $filepath = $this->uploadDir . $filename;

        if (file_exists($filepath)) {
            return unlink($filepath);
        }

        return false;
    }
}
?>

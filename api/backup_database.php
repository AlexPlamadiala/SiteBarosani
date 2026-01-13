<?php
/**
 * Database Backup Script
 * Creates automatic MySQL database backup
 *
 * Run manually: http://localhost/SiteBarosani/api/backup_database.php
 * Or add to cron: 0 3 * * * php /path/to/api/backup_database.php
 */

require_once 'config.php';
require_once 'helpers/Logger.php';

// Backup configuration
$backupDir = __DIR__ . '/../backups/';
$maxBackups = 30; // Keep last 30 backups

// Create backup directory
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0755, true);
}

try {
    // Generate filename
    $date = date('Y-m-d_H-i-s');
    $backupFile = $backupDir . 'backup_' . DB_NAME . '_' . $date . '.sql';

    // Build mysqldump command
    $command = sprintf(
        'mysqldump --user=%s --password=%s --host=%s %s > %s 2>&1',
        DB_USER,
        DB_PASS,
        DB_HOST,
        DB_NAME,
        escapeshellarg($backupFile)
    );

    // Execute backup
    exec($command, $output, $returnCode);

    if ($returnCode === 0 && file_exists($backupFile) && filesize($backupFile) > 0) {
        $fileSize = filesize($backupFile);
        $fileSizeMB = round($fileSize / 1024 / 1024, 2);

        logInfo("Database backup created successfully", [
            'file' => basename($backupFile),
            'size' => $fileSizeMB . ' MB'
        ]);

        echo "✅ Backup created successfully!\n";
        echo "📁 File: " . basename($backupFile) . "\n";
        echo "📊 Size: {$fileSizeMB} MB\n";

        // Compress backup
        $gzipFile = $backupFile . '.gz';
        $compressed = gzencode(file_get_contents($backupFile), 9);
        file_put_contents($gzipFile, $compressed);

        // Delete uncompressed file
        unlink($backupFile);

        $gzipSize = round(filesize($gzipFile) / 1024 / 1024, 2);
        echo "🗜️ Compressed: {$gzipSize} MB\n";

        // Cleanup old backups
        $backupFiles = glob($backupDir . 'backup_*.sql.gz');
        if (count($backupFiles) > $maxBackups) {
            // Sort by date (oldest first)
            usort($backupFiles, function($a, $b) {
                return filemtime($a) - filemtime($b);
            });

            // Delete oldest backups
            $filesToDelete = array_slice($backupFiles, 0, count($backupFiles) - $maxBackups);
            foreach ($filesToDelete as $file) {
                unlink($file);
                echo "🗑️ Deleted old backup: " . basename($file) . "\n";
            }
        }

        echo "\n📅 Total backups: " . count(glob($backupDir . 'backup_*.sql.gz')) . "\n";

    } else {
        throw new Exception("Backup failed. Return code: $returnCode. Output: " . implode("\n", $output));
    }

} catch (Exception $e) {
    logError("Database backup failed", ['error' => $e->getMessage()]);

    echo "❌ Backup failed!\n";
    echo "Error: " . $e->getMessage() . "\n";

    if (isset($output) && !empty($output)) {
        echo "Output: " . implode("\n", $output) . "\n";
    }
}
?>

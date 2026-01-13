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

    // Detect mysqldump path
    $mysqldumpPath = 'mysqldump';

    // Try XAMPP paths on Windows
    if (PHP_OS_FAMILY === 'Windows') {
        $possiblePaths = [
            'C:\\xampp\\mysql\\bin\\mysqldump.exe',
            'C:\\xampp\\mysql\\bin\\mysqldump',
            'mysqldump.exe',
            'mysqldump'
        ];

        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                $mysqldumpPath = $path;
                break;
            }
        }
    }

    // Build mysqldump command
    $passwordPart = !empty(DB_PASS) ? '--password=' . escapeshellarg(DB_PASS) : '';

    $command = sprintf(
        '%s --user=%s %s --host=%s %s > %s 2>&1',
        escapeshellarg($mysqldumpPath),
        escapeshellarg(DB_USER),
        $passwordPart,
        escapeshellarg(DB_HOST),
        escapeshellarg(DB_NAME),
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
        // mysqldump failed, try PHP-based backup
        echo "⚠️ mysqldump failed. Trying PHP-based backup...\n";

        $conn = getDBConnection();
        $backupContent = "-- Backup Database: " . DB_NAME . "\n";
        $backupContent .= "-- Created: " . date('Y-m-d H:i:s') . "\n\n";

        // Get all tables
        $tables = [];
        $result = $conn->query("SHOW TABLES");
        while ($row = $result->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        foreach ($tables as $table) {
            // Table structure
            $backupContent .= "\n-- Structure for table `$table`\n";
            $backupContent .= "DROP TABLE IF EXISTS `$table`;\n";

            $row = $conn->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_NUM);
            $backupContent .= $row[1] . ";\n\n";

            // Table data
            $backupContent .= "-- Data for table `$table`\n";
            $result = $conn->query("SELECT * FROM `$table`");

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $values = array_map(function($val) use ($conn) {
                    return $val === null ? 'NULL' : $conn->quote($val);
                }, array_values($row));

                $backupContent .= "INSERT INTO `$table` VALUES (" . implode(', ', $values) . ");\n";
            }
            $backupContent .= "\n";
        }

        file_put_contents($backupFile, $backupContent);

        if (file_exists($backupFile) && filesize($backupFile) > 0) {
            $fileSize = filesize($backupFile);
            $fileSizeMB = round($fileSize / 1024 / 1024, 2);

            logInfo("Database backup created successfully (PHP method)", [
                'file' => basename($backupFile),
                'size' => $fileSizeMB . ' MB'
            ]);

            echo "✅ Backup created successfully (PHP method)!\n";
            echo "📁 File: " . basename($backupFile) . "\n";
            echo "📊 Size: {$fileSizeMB} MB\n";

            // Compress backup
            $gzipFile = $backupFile . '.gz';
            $compressed = gzencode(file_get_contents($backupFile), 9);
            file_put_contents($gzipFile, $compressed);
            unlink($backupFile);

            $gzipSize = round(filesize($gzipFile) / 1024 / 1024, 2);
            echo "🗜️ Compressed: {$gzipSize} MB\n";

            // Cleanup old backups
            $backupFiles = glob($backupDir . 'backup_*.sql.gz');
            if (count($backupFiles) > $maxBackups) {
                usort($backupFiles, function($a, $b) {
                    return filemtime($a) - filemtime($b);
                });

                $filesToDelete = array_slice($backupFiles, 0, count($backupFiles) - $maxBackups);
                foreach ($filesToDelete as $file) {
                    unlink($file);
                    echo "🗑️ Deleted old backup: " . basename($file) . "\n";
                }
            }

            echo "\n📅 Total backups: " . count(glob($backupDir . 'backup_*.sql.gz')) . "\n";
        } else {
            throw new Exception("Both mysqldump and PHP backup failed. Check database connection.");
        }
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

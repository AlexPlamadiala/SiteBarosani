<?php
/**
 * Admin Logs Viewer Endpoint
 *
 * Returnează ultimele logs din fișierul de log
 */

require_once '../config.php';

$adminId = checkAdminAuth();

// GET - Citește logs
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $lines = isset($_GET['lines']) ? (int)$_GET['lines'] : 100;
        $lines = min($lines, 1000); // Max 1000 lines pentru performance

        // Calea către fișierul de log de astăzi
        $logFile = dirname(__DIR__) . '/logs/app_' . date('Y-m-d') . '.log';

        if (!file_exists($logFile)) {
            echo json_encode([
                'success' => true,
                'logs' => [],
                'message' => 'Niciun log pentru azi'
            ]);
            exit;
        }

        // Citește ultimele N linii din log
        $output = [];
        $file = new SplFileObject($logFile, 'r');
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key() + 1;

        $startLine = max(0, $totalLines - $lines);

        $file->seek($startLine);
        while (!$file->eof()) {
            $line = trim($file->fgets());
            if ($line) {
                $output[] = $line;
            }
        }

        // Parse log lines
        $logs = [];
        foreach ($output as $line) {
            $parsed = parseLogLine($line);
            if ($parsed) {
                $logs[] = $parsed;
            }
        }

        // Reverse pentru a avea cele mai recente primele
        $logs = array_reverse($logs);

        echo json_encode([
            'success' => true,
            'logs' => $logs,
            'total_lines' => $totalLines
        ]);

    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Parse o linie de log în structură
 * Format: [timestamp] [level] [IP] METHOD URI - message
 */
function parseLogLine($line) {
    // Pattern pentru log format
    $pattern = '/^\[([^\]]+)\] \[([^\]]+)\] \[([^\]]+)\] (\w+) ([^\s]+) - (.+)$/';

    if (preg_match($pattern, $line, $matches)) {
        return [
            'timestamp' => $matches[1],
            'level' => $matches[2],
            'ip' => $matches[3],
            'method' => $matches[4],
            'endpoint' => $matches[5],
            'message' => $matches[6]
        ];
    }

    // Fallback pentru linii care nu match pattern-ul
    return [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'INFO',
        'ip' => '-',
        'method' => '-',
        'endpoint' => '-',
        'message' => $line
    ];
}
?>

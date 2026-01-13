<?php
/**
 * Simple Logger
 * Logs errors and events to file
 */
class Logger {
    private $logFile;

    public function __construct($logType = 'app') {
        $logDir = __DIR__ . '/../logs/';

        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $this->logFile = $logDir . $logType . '_' . date('Y-m-d') . '.log';
    }

    /**
     * Log error message
     */
    public function error($message, $context = []) {
        $this->log('ERROR', $message, $context);
    }

    /**
     * Log warning message
     */
    public function warning($message, $context = []) {
        $this->log('WARNING', $message, $context);
    }

    /**
     * Log info message
     */
    public function info($message, $context = []) {
        $this->log('INFO', $message, $context);
    }

    /**
     * Log debug message
     */
    public function debug($message, $context = []) {
        if (EnvLoader::isDebug()) {
            $this->log('DEBUG', $message, $context);
        }
    }

    /**
     * Write log entry
     */
    private function log($level, $message, $context = []) {
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'CLI';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
        $uri = $_SERVER['REQUEST_URI'] ?? 'N/A';

        $logEntry = sprintf(
            "[%s] [%s] [%s] %s %s - %s\n",
            $timestamp,
            $level,
            $ip,
            $method,
            $uri,
            $message
        );

        if (!empty($context)) {
            $logEntry .= "Context: " . json_encode($context, JSON_UNESCAPED_UNICODE) . "\n";
        }

        file_put_contents($this->logFile, $logEntry, FILE_APPEND);
    }

    /**
     * Log exception
     */
    public function exception($exception) {
        $this->error(
            $exception->getMessage(),
            [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ]
        );
    }
}

// Global logger functions
function logError($message, $context = []) {
    $logger = new Logger('error');
    $logger->error($message, $context);
}

function logInfo($message, $context = []) {
    $logger = new Logger('info');
    $logger->info($message, $context);
}

function logWarning($message, $context = []) {
    $logger = new Logger('warning');
    $logger->warning($message, $context);
}
?>

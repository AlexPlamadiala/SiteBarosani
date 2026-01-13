<?php
/**
 * Simple Rate Limiter
 * Limits API requests per IP address
 */
class RateLimiter {
    private $storageFile;
    private $requestsLimit;
    private $timeWindow;

    public function __construct($requestsLimit = 100, $timeWindow = 3600) {
        $this->storageFile = __DIR__ . '/../logs/rate_limits.json';
        $this->requestsLimit = $requestsLimit; // Requests allowed
        $this->timeWindow = $timeWindow;       // Time window in seconds (default: 1 hour)

        // Create logs directory if doesn't exist
        $logsDir = dirname($this->storageFile);
        if (!file_exists($logsDir)) {
            mkdir($logsDir, 0755, true);
        }

        // Create file if doesn't exist
        if (!file_exists($this->storageFile)) {
            file_put_contents($this->storageFile, json_encode([]));
        }
    }

    /**
     * Check if request is allowed
     */
    public function check($identifier = null) {
        if ($identifier === null) {
            $identifier = $this->getClientIP();
        }

        $now = time();
        $limits = $this->loadLimits();

        // Clean old entries
        $limits = $this->cleanOldEntries($limits, $now);

        // Check if IP exists
        if (!isset($limits[$identifier])) {
            $limits[$identifier] = [
                'count' => 1,
                'first_request' => $now,
                'last_request' => $now
            ];
            $this->saveLimits($limits);
            return true;
        }

        $ipData = $limits[$identifier];

        // Check if time window expired
        if (($now - $ipData['first_request']) > $this->timeWindow) {
            // Reset counter
            $limits[$identifier] = [
                'count' => 1,
                'first_request' => $now,
                'last_request' => $now
            ];
            $this->saveLimits($limits);
            return true;
        }

        // Check if limit exceeded
        if ($ipData['count'] >= $this->requestsLimit) {
            // Calculate time remaining
            $timeRemaining = $this->timeWindow - ($now - $ipData['first_request']);
            http_response_code(429);
            header('Retry-After: ' . $timeRemaining);
            echo json_encode([
                'success' => false,
                'error' => 'Rate limit exceeded. Try again in ' . ceil($timeRemaining / 60) . ' minutes.',
                'retry_after' => $timeRemaining
            ]);
            exit;
        }

        // Increment counter
        $limits[$identifier]['count']++;
        $limits[$identifier]['last_request'] = $now;
        $this->saveLimits($limits);

        return true;
    }

    /**
     * Get remaining requests for identifier
     */
    public function getRemaining($identifier = null) {
        if ($identifier === null) {
            $identifier = $this->getClientIP();
        }

        $limits = $this->loadLimits();

        if (!isset($limits[$identifier])) {
            return $this->requestsLimit;
        }

        $now = time();
        $ipData = $limits[$identifier];

        if (($now - $ipData['first_request']) > $this->timeWindow) {
            return $this->requestsLimit;
        }

        return max(0, $this->requestsLimit - $ipData['count']);
    }

    /**
     * Get client IP address
     */
    private function getClientIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }

    /**
     * Load limits from storage
     */
    private function loadLimits() {
        $content = file_get_contents($this->storageFile);
        return json_decode($content, true) ?: [];
    }

    /**
     * Save limits to storage
     */
    private function saveLimits($limits) {
        file_put_contents($this->storageFile, json_encode($limits, JSON_PRETTY_PRINT));
    }

    /**
     * Clean old entries (older than time window)
     */
    private function cleanOldEntries($limits, $now) {
        foreach ($limits as $ip => $data) {
            if (($now - $data['first_request']) > ($this->timeWindow * 2)) {
                unset($limits[$ip]);
            }
        }
        return $limits;
    }
}
?>

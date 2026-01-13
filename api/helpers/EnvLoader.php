<?php
/**
 * Simple .env file loader
 * Loads environment variables from .env file
 */
class EnvLoader {
    protected static $loaded = false;
    protected static $vars = [];

    /**
     * Load .env file
     */
    public static function load($path = null) {
        if (self::$loaded) {
            return;
        }

        if ($path === null) {
            $path = dirname(dirname(__DIR__)) . '/.env';
        }

        if (!file_exists($path)) {
            throw new Exception('.env file not found at: ' . $path);
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Remove quotes
                $value = trim($value, '"\'');

                // Store in static array and $_ENV
                self::$vars[$key] = $value;
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }

        self::$loaded = true;
    }

    /**
     * Get environment variable
     */
    public static function get($key, $default = null) {
        if (!self::$loaded) {
            self::load();
        }

        return isset(self::$vars[$key]) ? self::$vars[$key] : $default;
    }

    /**
     * Check if environment is development
     */
    public static function isDevelopment() {
        return self::get('APP_ENV', 'production') === 'development';
    }

    /**
     * Check if debug mode is enabled
     */
    public static function isDebug() {
        return self::get('APP_DEBUG', 'false') === 'true';
    }
}
?>

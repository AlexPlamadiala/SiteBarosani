<?php
/**
 * SSE (Server-Sent Events) Endpoint pentru Real-Time Updates
 *
 * Acest endpoint menține o conexiune deschisă cu clienții și le notifică
 * instant când se fac modificări în database (barosani, cereri, etc.)
 *
 * Usage în frontend:
 * const eventSource = new EventSource('http://localhost/SiteBarosani/api/sse/updates.php');
 * eventSource.addEventListener('barosani-updated', (e) => { ... });
 */

// Prevent PHP timeout for long-running SSE connection
set_time_limit(0);
ignore_user_abort(true);

// Setări pentru SSE
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no'); // Disable nginx buffering

// CORS pentru development
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

// Disable PHP output buffering
if (function_exists('apache_setenv')) {
    @apache_setenv('no-gzip', '1');
}
@ini_set('zlib.output_compression', 0);
@ini_set('implicit_flush', 1);
ob_implicit_flush(1);
while (ob_get_level()) {
    ob_end_flush();
}

// Load ChangeTracker
require_once __DIR__ . '/../helpers/ChangeTracker.php';
$tracker = new ChangeTracker();

// Client tracking pentru last known state
$clientId = isset($_GET['client_id']) ? $_GET['client_id'] : uniqid('client_');
$lastCheck = [
    'barosani' => time(),
    'applications' => time()
];

// Funcție helper pentru a trimite evenimente SSE
function sendSSE($event, $data) {
    echo "event: {$event}\n";
    echo "data: " . json_encode($data) . "\n\n";
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
}

// Trimite mesaj de conectare
sendSSE('connected', [
    'message' => 'SSE connection established',
    'client_id' => $clientId,
    'timestamp' => time()
]);

// Loop infinit pentru a verifica modificări
$heartbeatInterval = 15; // Heartbeat la fiecare 15 secunde
$checkInterval = 1; // Verifică pentru changes la fiecare secundă
$lastHeartbeat = time();

while (true) {
    // Verifică dacă clientul e încă conectat
    if (connection_aborted()) {
        break;
    }

    $currentTime = time();

    // Verifică pentru modificări în barosani
    if ($tracker->hasChangedSince('barosani', $lastCheck['barosani'])) {
        $lastModified = $tracker->getLastModified('barosani');
        sendSSE('barosani-updated', [
            'timestamp' => $lastModified,
            'message' => 'Barosani data has been updated'
        ]);
        $lastCheck['barosani'] = $lastModified;
    }

    // Verifică pentru modificări în applications
    if ($tracker->hasChangedSince('applications', $lastCheck['applications'])) {
        $lastModified = $tracker->getLastModified('applications');
        sendSSE('applications-updated', [
            'timestamp' => $lastModified,
            'message' => 'Applications data has been updated'
        ]);
        $lastCheck['applications'] = $lastModified;
    }

    // Heartbeat pentru a menține conexiunea vie
    if ($currentTime - $lastHeartbeat >= $heartbeatInterval) {
        sendSSE('heartbeat', [
            'timestamp' => $currentTime
        ]);
        $lastHeartbeat = $currentTime;
    }

    // Sleep pentru a nu consuma prea mult CPU
    sleep($checkInterval);
}

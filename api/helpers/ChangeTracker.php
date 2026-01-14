<?php
/**
 * ChangeTracker - Sistem de tracking pentru modificări în timp real
 *
 * Folosit de SSE (Server-Sent Events) pentru a notifica clienții
 * când se fac modificări în database (barosani, cereri, etc.)
 */

class ChangeTracker {
    private $changeFile;

    public function __construct() {
        $this->changeFile = __DIR__ . '/../logs/changes.json';

        // Creează fișierul dacă nu există
        if (!file_exists($this->changeFile)) {
            $this->initChangeFile();
        }
    }

    /**
     * Inițializează fișierul de changes
     */
    private function initChangeFile() {
        $initialData = [
            'barosani' => [
                'last_modified' => time(),
                'count' => 0
            ],
            'applications' => [
                'last_modified' => time(),
                'count' => 0
            ]
        ];

        file_put_contents($this->changeFile, json_encode($initialData, JSON_PRETTY_PRINT));
    }

    /**
     * Notifică că s-a făcut o modificare
     *
     * @param string $entity Tipul entității modificate (barosani, applications)
     * @param string $action Acțiunea efectuată (created, updated, deleted, approved, rejected)
     */
    public function notifyChange($entity, $action = 'updated') {
        $data = $this->getChanges();

        if (!isset($data[$entity])) {
            $data[$entity] = [
                'last_modified' => time(),
                'count' => 0
            ];
        }

        $data[$entity]['last_modified'] = time();
        $data[$entity]['count']++;
        $data[$entity]['last_action'] = $action;

        file_put_contents($this->changeFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    /**
     * Obține toate change-urile
     *
     * @return array
     */
    public function getChanges() {
        if (!file_exists($this->changeFile)) {
            $this->initChangeFile();
        }

        $content = file_get_contents($this->changeFile);
        return json_decode($content, true);
    }

    /**
     * Obține timestamp-ul ultimei modificări pentru o entitate
     *
     * @param string $entity
     * @return int|null
     */
    public function getLastModified($entity) {
        $data = $this->getChanges();
        return isset($data[$entity]['last_modified']) ? $data[$entity]['last_modified'] : null;
    }

    /**
     * Verifică dacă s-au făcut modificări după un anumit timestamp
     *
     * @param string $entity
     * @param int $since Timestamp
     * @return bool
     */
    public function hasChangedSince($entity, $since) {
        $lastModified = $this->getLastModified($entity);
        return $lastModified && $lastModified > $since;
    }
}

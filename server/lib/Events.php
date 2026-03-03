<?php

declare(strict_types=1);

function ensureEventSchema(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS events (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            start_at DATETIME NULL,
            end_at DATETIME NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )'
    );

    $columnCheck = $pdo->query("SHOW COLUMNS FROM requests LIKE 'event_id'");
    $column = $columnCheck ? $columnCheck->fetch() : false;
    if (!$column) {
        $pdo->exec('ALTER TABLE requests ADD COLUMN event_id INT UNSIGNED NULL AFTER request_ip');
        $pdo->exec('ALTER TABLE requests ADD INDEX idx_requests_event_id (event_id)');
    }
}

function listEvents(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT id, name, is_active, start_at, end_at, created_at FROM events ORDER BY id DESC');
    return $stmt ? $stmt->fetchAll() : [];
}

function setActiveEvent(PDO $pdo, int $eventId): void
{
    $pdo->beginTransaction();
    try {
        $resetStmt = $pdo->prepare('UPDATE events SET is_active = 0');
        $resetStmt->execute();

        $activateStmt = $pdo->prepare('UPDATE events SET is_active = 1 WHERE id = :id');
        $activateStmt->execute([':id' => $eventId]);

        $settingsStmt = $pdo->prepare(
            'INSERT INTO settings (name, value)
             VALUES (:name, :value)
             ON DUPLICATE KEY UPDATE value = VALUES(value)'
        );
        $settingsStmt->execute([
            ':name' => 'active_event_id',
            ':value' => (string) $eventId,
        ]);

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function createEvent(PDO $pdo, string $name, ?string $startAt = null): int
{
    $stmt = $pdo->prepare(
        'INSERT INTO events (name, start_at, is_active) VALUES (:name, :start_at, 0)'
    );
    $stmt->execute([
        ':name' => $name,
        ':start_at' => $startAt,
    ]);
    return (int) $pdo->lastInsertId();
}

function getActiveEventId(PDO $pdo): int
{
    ensureEventSchema($pdo);

    $settingsStmt = $pdo->prepare('SELECT value FROM settings WHERE name = :name LIMIT 1');
    $settingsStmt->execute([':name' => 'active_event_id']);
    $settingsRow = $settingsStmt->fetch();
    $settingsEventId = (int) ($settingsRow['value'] ?? 0);

    if ($settingsEventId > 0) {
        $existsStmt = $pdo->prepare('SELECT id FROM events WHERE id = :id LIMIT 1');
        $existsStmt->execute([':id' => $settingsEventId]);
        $exists = $existsStmt->fetch();
        if ($exists) {
            return $settingsEventId;
        }
    }

    $activeStmt = $pdo->query('SELECT id FROM events WHERE is_active = 1 ORDER BY id DESC LIMIT 1');
    $activeRow = $activeStmt ? $activeStmt->fetch() : false;
    if ($activeRow && isset($activeRow['id'])) {
        $activeId = (int) $activeRow['id'];
        setActiveEvent($pdo, $activeId);
        return $activeId;
    }

    $createStmt = $pdo->prepare('INSERT INTO events (name, is_active) VALUES (:name, 1)');
    $createStmt->execute([':name' => 'The Basement 28.02.26']);
    $eventId = (int) $pdo->lastInsertId();

    $settingsUpsert = $pdo->prepare(
        'INSERT INTO settings (name, value)
         VALUES (:name, :value)
         ON DUPLICATE KEY UPDATE value = VALUES(value)'
    );
    $settingsUpsert->execute([
        ':name' => 'active_event_id',
        ':value' => (string) $eventId,
    ]);

    return $eventId;
}

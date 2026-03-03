<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';
require_once __DIR__ . '/../../lib/Events.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

requireAdminAuth();
$pdo = db();
ensureEventSchema($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = listEvents($pdo);
    $activeEventId = getActiveEventId($pdo);
    jsonResponse([
        'data' => $events,
        'active_event_id' => $activeEventId,
    ], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only GET and POST are allowed.',
    ], 405);
}

$raw = file_get_contents('php://input');
$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    jsonResponse([
        'error' => 'invalid_payload',
        'message' => 'Invalid JSON payload.',
    ], 400);
}

$action = isset($payload['action']) ? trim((string) $payload['action']) : '';

if ($action === 'create') {
    $name = trim((string) ($payload['name'] ?? ''));
    if ($name === '') {
        jsonResponse([
            'error' => 'invalid_name',
            'message' => 'Event name is required.',
        ], 400);
    }

    $eventId = createEvent($pdo, $name);
    setActiveEvent($pdo, $eventId);

    jsonResponse([
        'ok' => true,
        'event_id' => $eventId,
        'data' => listEvents($pdo),
        'active_event_id' => $eventId,
    ], 201);
}

if ($action === 'set_active') {
    $eventId = (int) ($payload['event_id'] ?? 0);
    if ($eventId <= 0) {
        jsonResponse([
            'error' => 'invalid_event_id',
            'message' => 'Valid event id is required.',
        ], 400);
    }

    $existsStmt = $pdo->prepare('SELECT id FROM events WHERE id = :id LIMIT 1');
    $existsStmt->execute([':id' => $eventId]);
    $exists = $existsStmt->fetch();
    if (!$exists) {
        jsonResponse([
            'error' => 'event_not_found',
            'message' => 'Event not found.',
        ], 404);
    }

    setActiveEvent($pdo, $eventId);

    jsonResponse([
        'ok' => true,
        'data' => listEvents($pdo),
        'active_event_id' => $eventId,
    ], 200);
}

if ($action === 'rename') {
    $eventId = (int) ($payload['event_id'] ?? 0);
    $name = trim((string) ($payload['name'] ?? ''));
    if ($eventId <= 0) {
        jsonResponse([
            'error' => 'invalid_event_id',
            'message' => 'Valid event id is required.',
        ], 400);
    }
    if ($name === '') {
        jsonResponse([
            'error' => 'invalid_name',
            'message' => 'Event name is required.',
        ], 400);
    }

    $stmt = $pdo->prepare('UPDATE events SET name = :name WHERE id = :id');
    $stmt->execute([
        ':name' => $name,
        ':id' => $eventId,
    ]);

    if ($stmt->rowCount() === 0) {
        $existsStmt = $pdo->prepare('SELECT id FROM events WHERE id = :id LIMIT 1');
        $existsStmt->execute([':id' => $eventId]);
        if (!$existsStmt->fetch()) {
            jsonResponse([
                'error' => 'event_not_found',
                'message' => 'Event not found.',
            ], 404);
        }
    }

    jsonResponse([
        'ok' => true,
        'data' => listEvents($pdo),
        'active_event_id' => getActiveEventId($pdo),
    ], 200);
}

if ($action === 'delete') {
    $eventId = (int) ($payload['event_id'] ?? 0);
    if ($eventId <= 0) {
        jsonResponse([
            'error' => 'invalid_event_id',
            'message' => 'Valid event id is required.',
        ], 400);
    }

    $countStmt = $pdo->query('SELECT COUNT(*) AS total FROM events');
    $countRow = $countStmt ? $countStmt->fetch() : null;
    $totalEvents = (int) ($countRow['total'] ?? 0);

    $existsStmt = $pdo->prepare('SELECT id, is_active FROM events WHERE id = :id LIMIT 1');
    $existsStmt->execute([':id' => $eventId]);
    $eventRow = $existsStmt->fetch();
    if (!$eventRow) {
        jsonResponse([
            'error' => 'event_not_found',
            'message' => 'Event not found.',
        ], 404);
    }

    $isActive = (int) ($eventRow['is_active'] ?? 0) === 1;
    $isLastEvent = $totalEvents <= 1;

    $pdo->beginTransaction();
    try {
        $clearRequestsStmt = $pdo->prepare('UPDATE requests SET event_id = NULL WHERE event_id = :event_id');
        $clearRequestsStmt->execute([':event_id' => $eventId]);

        $nextActiveEventId = 0;

        if ($isLastEvent) {
            $createFallbackStmt = $pdo->prepare('INSERT INTO events (name, is_active) VALUES (:name, 1)');
            $createFallbackStmt->execute([':name' => 'Default Event']);
            $nextActiveEventId = (int) $pdo->lastInsertId();
        }

        $deleteStmt = $pdo->prepare('DELETE FROM events WHERE id = :id');
        $deleteStmt->execute([':id' => $eventId]);

        if (!$isLastEvent && $isActive) {
            $nextActiveStmt = $pdo->query('SELECT id FROM events ORDER BY id DESC LIMIT 1');
            $nextActiveRow = $nextActiveStmt ? $nextActiveStmt->fetch() : false;
            $nextActiveEventId = (int) ($nextActiveRow['id'] ?? 0);
        }

        if ($nextActiveEventId > 0) {
            $resetStmt = $pdo->prepare('UPDATE events SET is_active = 0');
            $resetStmt->execute();

            $activateStmt = $pdo->prepare('UPDATE events SET is_active = 1 WHERE id = :id');
            $activateStmt->execute([':id' => $nextActiveEventId]);
        }

        $settingsStmt = $pdo->prepare(
            'INSERT INTO settings (name, value)
             VALUES (:name, :value)
             ON DUPLICATE KEY UPDATE value = VALUES(value)'
        );
        $settingsStmt->execute([
            ':name' => 'active_event_id',
            ':value' => (string) $nextActiveEventId,
        ]);

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    jsonResponse([
        'ok' => true,
        'data' => listEvents($pdo),
        'active_event_id' => getActiveEventId($pdo),
    ], 200);
}

jsonResponse([
    'error' => 'invalid_action',
    'message' => 'Action must be create, set_active, rename or delete.',
], 400);

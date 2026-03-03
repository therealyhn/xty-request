<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';
require_once __DIR__ . '/../../lib/Events.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only GET is allowed.',
    ], 405);
}

requireAdminAuth();
$pdo = db();
ensureEventSchema($pdo);

$status = isset($_GET['status']) ? trim((string) $_GET['status']) : '';
$eventId = isset($_GET['event_id']) ? (int) $_GET['event_id'] : 0;
$allowed = ['new', 'accepted', 'played', 'declined'];

$sql = 'SELECT id, track_id, track_title, track_artist, track_album, track_cover, track_preview, track_link, nickname, message, status, created_at, event_id
        FROM requests';
$params = [];
$where = [];

if ($status !== '' && in_array($status, $allowed, true)) {
    $where[] = 'status = :status';
    $params[':status'] = $status;
}

if ($eventId > 0) {
    $where[] = 'event_id = :event_id';
    $params[':event_id'] = $eventId;
}

if (count($where) > 0) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}

$sql .= ' ORDER BY created_at DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

jsonResponse([
    'data' => $rows,
    'active_event_id' => getActiveEventId($pdo),
], 200);

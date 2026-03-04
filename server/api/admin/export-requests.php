<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';
require_once __DIR__ . '/../../lib/Events.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $origin = env('APP_URL', '*');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(200);
    exit;
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

$eventId = isset($_GET['event_id']) ? (int) $_GET['event_id'] : 0;
if ($eventId <= 0) {
    $eventId = getActiveEventId($pdo);
}

$eventNameStmt = $pdo->prepare('SELECT name FROM events WHERE id = :id LIMIT 1');
$eventNameStmt->execute([':id' => $eventId]);
$eventRow = $eventNameStmt->fetch();
$eventName = (string) ($eventRow['name'] ?? 'event');

$stmt = $pdo->prepare(
    'SELECT created_at, status, track_title, track_artist, track_album, nickname, message, track_link
     FROM requests
     WHERE event_id = :event_id
     ORDER BY created_at DESC'
);
$stmt->execute([':event_id' => $eventId]);
$rows = $stmt->fetchAll();

$safeEventName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $eventName);
$filename = sprintf('requests_%s_%d.csv', $safeEventName ?: 'event', $eventId);

$origin = env('APP_URL', '*');
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');
if ($output === false) {
    exit;
}

fputcsv($output, ['created_at', 'status', 'track_title', 'track_artist', 'track_album', 'nickname', 'comment', 'track_link']);

foreach ($rows as $row) {
    fputcsv($output, [
        (string) ($row['created_at'] ?? ''),
        (string) ($row['status'] ?? ''),
        (string) ($row['track_title'] ?? ''),
        (string) ($row['track_artist'] ?? ''),
        (string) ($row['track_album'] ?? ''),
        (string) ($row['nickname'] ?? ''),
        (string) ($row['message'] ?? ''),
        (string) ($row['track_link'] ?? ''),
    ]);
}

fclose($output);
exit;

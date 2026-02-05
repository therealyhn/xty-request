<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';
require_once __DIR__ . '/../../lib/Push.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only POST is allowed.',
    ], 405);
}

requireAdminAuth();

$raw = file_get_contents('php://input');
$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    jsonResponse([
        'error' => 'invalid_payload',
        'message' => 'Invalid JSON payload.',
    ], 400);
}

$id = isset($payload['id']) ? (int) $payload['id'] : 0;
$status = isset($payload['status']) ? trim((string) $payload['status']) : '';

if ($id <= 0) {
    jsonResponse([
        'error' => 'invalid_id',
        'message' => 'Invalid request id.',
    ], 400);
}

$allowed = ['new', 'accepted', 'played', 'declined'];
if (!in_array($status, $allowed, true)) {
    jsonResponse([
        'error' => 'invalid_status',
        'message' => 'Status must be new, accepted, played, or declined.',
    ], 400);
}

$stmt = db()->prepare('UPDATE requests SET status = :status WHERE id = :id');
$stmt->execute([
    ':status' => $status,
    ':id' => $id,
]);

if (in_array($status, ['accepted', 'declined'], true)) {
    $trackStmt = db()->prepare('SELECT track_title, track_artist FROM requests WHERE id = :id');
    $trackStmt->execute([':id' => $id]);
    $track = $trackStmt->fetch();
    if (is_array($track)) {
        sendStatusPush($id, $status, [
            'title' => $track['track_title'] ?? '',
            'artist' => $track['track_artist'] ?? '',
        ]);
    }
}

jsonResponse(['ok' => true], 200);

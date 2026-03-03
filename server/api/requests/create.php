<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/Events.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only POST is allowed.',
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

$nickname = '';
$message = isset($payload['message']) ? trim((string) $payload['message']) : '';
$track = isset($payload['track']) && is_array($payload['track']) ? $payload['track'] : null;

if ($message !== '' && mb_strlen($message) > 200) {
    jsonResponse([
        'error' => 'invalid_message',
        'message' => 'Message must be 200 characters or less.',
    ], 400);
}

if (!$track || empty($track['id']) || empty($track['title'])) {
    jsonResponse([
        'error' => 'invalid_track',
        'message' => 'Track selection is required.',
    ], 400);
}

$trackId = (string) $track['id'];
$trackTitle = (string) ($track['title'] ?? '');
$trackArtist = (string) ($track['artist']['name'] ?? '');
$trackAlbum = (string) ($track['album']['title'] ?? '');
$trackCover = (string) ($track['album']['cover_medium'] ?? '');
$trackPreview = (string) ($track['preview'] ?? '');
$trackLink = (string) ($track['link'] ?? '');
$requestIp = getClientIp();
$pdo = db();
$eventId = getActiveEventId($pdo);

// Request limit: max 2 requests per fixed 15-minute window, anchored at user's first request.
$firstRequestStmt = $pdo->prepare(
    'SELECT MIN(created_at) AS first_at FROM requests WHERE request_ip = :request_ip AND event_id = :event_id'
);
$firstRequestStmt->execute([
    ':request_ip' => $requestIp,
    ':event_id' => $eventId,
]);
$firstRequestData = $firstRequestStmt->fetch();
$firstAt = isset($firstRequestData['first_at']) ? strtotime((string) $firstRequestData['first_at']) : false;

if ($firstAt !== false) {
    $now = time();
    $windowSize = 900; // 15 minutes
    $windowIndex = (int) floor(($now - $firstAt) / $windowSize);
    $windowStartTs = $firstAt + ($windowIndex * $windowSize);
    $windowEndTs = $windowStartTs + $windowSize;

    $windowStart = date('Y-m-d H:i:s', $windowStartTs);
    $windowEnd = date('Y-m-d H:i:s', $windowEndTs);

    $windowCountStmt = $pdo->prepare(
        'SELECT COUNT(*) AS total
         FROM requests
         WHERE request_ip = :request_ip
           AND event_id = :event_id
           AND created_at >= :window_start
           AND created_at < :window_end'
    );
    $windowCountStmt->execute([
        ':request_ip' => $requestIp,
        ':event_id' => $eventId,
        ':window_start' => $windowStart,
        ':window_end' => $windowEnd,
    ]);
    $windowCountData = $windowCountStmt->fetch();
    $requestCount = (int) ($windowCountData['total'] ?? 0);

    if ($requestCount >= 2) {
        $retrySeconds = max(1, $windowEndTs - $now);

        jsonResponse([
            'error' => 'request_limit_reached',
            'message' => 'Limit reached: 2 requests per 15 minutes. Please wait before sending another request.',
            'retry_seconds' => $retrySeconds,
        ], 429);
    }
}

$stmt = $pdo->prepare(
    'INSERT INTO requests (track_id, track_title, track_artist, track_album, track_cover, track_preview, track_link, nickname, message, status, request_ip, event_id)
     VALUES (:track_id, :track_title, :track_artist, :track_album, :track_cover, :track_preview, :track_link, :nickname, :message, :status, :request_ip, :event_id)'
);

$stmt->execute([
    ':track_id' => $trackId,
    ':track_title' => $trackTitle,
    ':track_artist' => $trackArtist,
    ':track_album' => $trackAlbum,
    ':track_cover' => $trackCover,
    ':track_preview' => $trackPreview,
    ':track_link' => $trackLink,
    ':nickname' => $nickname,
    ':message' => $message,
    ':status' => 'new',
    ':request_ip' => $requestIp,
    ':event_id' => $eventId,
]);

$id = (int) $pdo->lastInsertId();
jsonResponse(['ok' => true, 'id' => $id], 201);

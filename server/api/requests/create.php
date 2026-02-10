<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';

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

$stmt = db()->prepare(
    'INSERT INTO requests (track_id, track_title, track_artist, track_album, track_cover, track_preview, track_link, nickname, message, status, request_ip)
     VALUES (:track_id, :track_title, :track_artist, :track_album, :track_cover, :track_preview, :track_link, :nickname, :message, :status, :request_ip)'
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
    ':request_ip' => getClientIp(),
]);

$id = (int) db()->lastInsertId();
jsonResponse(['ok' => true, 'id' => $id], 201);

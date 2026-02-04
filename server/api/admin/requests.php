<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';

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

$status = isset($_GET['status']) ? trim((string) $_GET['status']) : '';
$allowed = ['new', 'played', 'declined'];

$sql = 'SELECT id, track_id, track_title, track_artist, track_album, track_cover, track_preview, track_link, nickname, message, status, created_at
        FROM requests';
$params = [];

if ($status !== '' && in_array($status, $allowed, true)) {
    $sql .= ' WHERE status = :status';
    $params[':status'] = $status;
}

$sql .= ' ORDER BY created_at DESC';

$stmt = db()->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

jsonResponse(['data' => $rows], 200);

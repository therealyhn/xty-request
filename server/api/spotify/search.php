<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/SpotifyClient.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only GET is allowed.',
    ], 405);
}

$query = isset($_GET['q']) ? trim((string) $_GET['q']) : '';
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;

if ($query === '' || mb_strlen($query) < 2 || mb_strlen($query) > 80) {
    jsonResponse([
        'error' => 'invalid_query',
        'message' => 'Query must be between 2 and 80 characters.',
    ], 400);
}

if (!preg_match('/^[\\p{L}\\p{N}\\s\\-\\\'\\.,:&\\(\\)]+$/u', $query)) {
    jsonResponse([
        'error' => 'invalid_query',
        'message' => 'Query contains unsupported characters.',
    ], 400);
}

if ($limit < 1 || $limit > 20) {
    $limit = 10;
}

$window = (int) (env('RATE_LIMIT_WINDOW_SECONDS', '60'));
$max = (int) (env('RATE_LIMIT_MAX_REQUESTS', '15'));
$ipKey = md5(getClientIp());
rateLimit($ipKey, $max, $window);

$data = spotifySearchTracks($query, $limit);

jsonResponse([
    'data' => $data,
], 200);

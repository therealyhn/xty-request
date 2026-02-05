<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse([
        'error' => 'method_not_allowed',
        'message' => 'Only GET is allowed.',
    ], 405);
}

$key = env('VAPID_PUBLIC_KEY');
if (!$key) {
    jsonResponse([
        'error' => 'server_misconfigured',
        'message' => 'VAPID public key is missing.',
    ], 500);
}

jsonResponse([
    'publicKey' => $key,
], 200);

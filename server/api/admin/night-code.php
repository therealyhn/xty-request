<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Database.php';
require_once __DIR__ . '/../../lib/AdminAuth.php';
require_once __DIR__ . '/../../lib/Settings.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse(['ok' => true], 200);
}

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $value = getSetting('night_code');
    jsonResponse(['data' => ['night_code' => $value ?? '']], 200);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode((string) $raw, true);
    if (!is_array($payload)) {
        jsonResponse([
            'error' => 'invalid_payload',
            'message' => 'Invalid JSON payload.',
        ], 400);
    }

    $code = isset($payload['night_code']) ? trim((string) $payload['night_code']) : '';
    if ($code === '' || mb_strlen($code) > 20) {
        jsonResponse([
            'error' => 'invalid_night_code',
            'message' => 'Night code is required and must be 20 characters or less.',
        ], 400);
    }

    setSetting('night_code', $code);
    jsonResponse(['ok' => true], 200);
}

jsonResponse([
    'error' => 'method_not_allowed',
    'message' => 'Only GET and POST are allowed.',
], 405);

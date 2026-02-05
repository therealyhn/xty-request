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

$requestId = isset($payload['request_id']) ? (int) $payload['request_id'] : 0;
$subscription = isset($payload['subscription']) && is_array($payload['subscription']) ? $payload['subscription'] : null;

if ($requestId <= 0 || !$subscription) {
    jsonResponse([
        'error' => 'invalid_payload',
        'message' => 'Request id and subscription are required.',
    ], 400);
}

$endpoint = isset($subscription['endpoint']) ? trim((string) $subscription['endpoint']) : '';
$keys = isset($subscription['keys']) && is_array($subscription['keys']) ? $subscription['keys'] : [];
$p256dh = isset($keys['p256dh']) ? trim((string) $keys['p256dh']) : '';
$auth = isset($keys['auth']) ? trim((string) $keys['auth']) : '';

if ($endpoint === '' || $p256dh === '' || $auth === '') {
    jsonResponse([
        'error' => 'invalid_subscription',
        'message' => 'Subscription endpoint and keys are required.',
    ], 400);
}

$exists = db()->prepare('SELECT id FROM requests WHERE id = :id');
$exists->execute([':id' => $requestId]);
if (!$exists->fetch()) {
    jsonResponse([
        'error' => 'request_not_found',
        'message' => 'Request not found.',
    ], 404);
}

$delete = db()->prepare('DELETE FROM push_subscriptions WHERE request_id = :id AND endpoint = :endpoint');
$delete->execute([
    ':id' => $requestId,
    ':endpoint' => $endpoint,
]);

$stmt = db()->prepare(
    'INSERT INTO push_subscriptions (request_id, endpoint, p256dh, auth)
     VALUES (:request_id, :endpoint, :p256dh, :auth)'
);
$stmt->execute([
    ':request_id' => $requestId,
    ':endpoint' => $endpoint,
    ':p256dh' => $p256dh,
    ':auth' => $auth,
]);

jsonResponse(['ok' => true], 201);

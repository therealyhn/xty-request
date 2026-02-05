<?php

declare(strict_types=1);

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

function pushConfigured(): bool
{
    return (bool) (env('VAPID_PUBLIC_KEY') && env('VAPID_PRIVATE_KEY'));
}

function sendStatusPush(int $requestId, string $status, array $track): void
{
    if (!pushConfigured()) {
        return;
    }

    $stmt = db()->prepare('SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE request_id = :id');
    $stmt->execute([':id' => $requestId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rows) {
        return;
    }

    $payload = json_encode([
        'type' => 'request_status',
        'status' => $status,
        'track' => [
            'title' => $track['title'] ?? '',
            'artist' => $track['artist'] ?? '',
        ],
    ], JSON_UNESCAPED_SLASHES);

    $webPush = new WebPush([
        'VAPID' => [
            'subject' => env('APP_URL', 'mailto:admin@xty-music.com'),
            'publicKey' => env('VAPID_PUBLIC_KEY'),
            'privateKey' => env('VAPID_PRIVATE_KEY'),
        ],
    ]);

    foreach ($rows as $row) {
        $subscription = Subscription::create([
            'endpoint' => $row['endpoint'],
            'keys' => [
                'p256dh' => $row['p256dh'],
                'auth' => $row['auth'],
            ],
        ]);
        $webPush->queueNotification($subscription, $payload);
    }

    $webPush->flush();

    $cleanup = db()->prepare('DELETE FROM push_subscriptions WHERE request_id = :id');
    $cleanup->execute([':id' => $requestId]);
}

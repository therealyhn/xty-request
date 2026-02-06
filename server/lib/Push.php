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
            'subject' => env('APP_URL', 'mailto:[EMAIL_ADDRESS]'),
            'publicKey' => env('VAPID_PUBLIC_KEY'),
            'privateKey' => env('VAPID_PRIVATE_KEY'),
        ],
    ]);

    $failedIds = [];
    foreach ($rows as $row) {
        $subscription = Subscription::create([
            'endpoint' => $row['endpoint'],
            'keys' => [
                'p256dh' => $row['p256dh'],
                'auth' => $row['auth'],
            ],
        ]);
        $webPush->queueNotification($subscription, $payload);
        $failedIds[] = (int) $row['id'];
    }

    $reports = $webPush->flush();

    $failed = [];
    $failedEndpoints = [];
    foreach ($reports as $report) {
        if (!$report->isSuccess()) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            $failed[] = [
                'endpoint' => $endpoint,
                'reason' => $report->getReason(),
                'status' => $report->getResponse() ? $report->getResponse()->getStatusCode() : null,
            ];
            $failedEndpoints[$endpoint] = true;
        }
    }

    if ($failed) {
        $logPath = __DIR__ . '/../storage/push.log';
        $line = json_encode([
            'request_id' => $requestId,
            'status' => $status,
            'failed' => $failed,
            'at' => date('c'),
        ], JSON_UNESCAPED_SLASHES);
        file_put_contents($logPath, $line . PHP_EOL, FILE_APPEND);
    }

    if ($failedEndpoints) {
        $placeholders = implode(',', array_fill(0, count($failedEndpoints), '?'));
        $cleanup = db()->prepare(
            "DELETE FROM push_subscriptions WHERE request_id = ? AND endpoint NOT IN ($placeholders)"
        );
        $cleanup->execute(array_merge([$requestId], array_keys($failedEndpoints)));
    } else {
        $cleanup = db()->prepare('DELETE FROM push_subscriptions WHERE request_id = ?');
        $cleanup->execute([$requestId]);
    }
}

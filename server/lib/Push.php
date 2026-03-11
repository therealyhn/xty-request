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

    $stmt = db()->prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE request_id = :id');
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

    $reports = $webPush->flush();

    $successCount = 0;
    $failed = [];
    $invalidEndpoints = [];
    foreach ($reports as $report) {
        if ($report->isSuccess()) {
            $successCount++;
            continue;
        }

        $endpoint = $report->getRequest()->getUri()->__toString();
        $reason = (string) $report->getReason();
        $httpStatus = $report->getResponse() ? $report->getResponse()->getStatusCode() : null;
        $failed[] = [
            'endpoint' => $endpoint,
            'reason' => $reason,
            'status' => $httpStatus,
        ];

        $reasonLower = strtolower($reason);
        if (in_array($httpStatus, [404, 410], true)
            || str_contains($reasonLower, 'unsubscribed')
            || str_contains($reasonLower, 'expired')
            || str_contains($reasonLower, 'gone')) {
            $invalidEndpoints[$endpoint] = true;
        }
    }

    if ($failed) {
        $logPath = __DIR__ . '/../storage/push.log';
        $line = json_encode([
            'request_id' => $requestId,
            'status' => $status,
            'success_count' => $successCount,
            'failed' => $failed,
            'at' => date('c'),
        ], JSON_UNESCAPED_SLASHES);
        file_put_contents($logPath, $line . PHP_EOL, FILE_APPEND);
    }

    if ($invalidEndpoints) {
        $placeholders = implode(',', array_fill(0, count($invalidEndpoints), '?'));
        $cleanup = db()->prepare(
            "DELETE FROM push_subscriptions WHERE request_id = ? AND endpoint IN ($placeholders)"
        );
        $cleanup->execute(array_merge([$requestId], array_keys($invalidEndpoints)));
    }
}

<?php

declare(strict_types=1);

function loadEnv(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return [];
    }

    $env = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }

        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));

        if ($value !== '' && $value[0] === '"' && substr($value, -1) === '"') {
            $value = substr($value, 1, -1);
        }

        $env[$key] = $value;
    }

    return $env;
}

$ENV = loadEnv(__DIR__ . '/.env');

function env(string $key, ?string $default = null): ?string
{
    global $ENV;
    return $ENV[$key] ?? $default;
}

function jsonResponse(array $payload, int $status = 200): void
{
    $origin = env('APP_URL', '*');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function getClientIp(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return $ip;
}

function withFileLock(string $path, callable $callback): mixed
{
    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    $handle = fopen($path, 'c+');
    if ($handle === false) {
        return $callback(null);
    }

    flock($handle, LOCK_EX);
    $result = $callback($handle);
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $result;
}

function rateLimit(string $key, int $maxRequests, int $windowSeconds): void
{
    // Sanitize key for valid filename (replace non-alphanumeric with underscore)
    $safeKey = preg_replace('/[^a-zA-Z0-9_-]/', '_', $key);
    $path = __DIR__ . '/storage/ratelimit_' . $safeKey . '.json';

    $state = withFileLock($path, function ($handle) {
        if ($handle === null) {
            return ['count' => 0, 'reset_at' => 0];
        }
        $contents = stream_get_contents($handle);
        if ($contents === false || trim($contents) === '') {
            return ['count' => 0, 'reset_at' => 0];
        }
        $decoded = json_decode($contents, true);
        if (!is_array($decoded)) {
            return ['count' => 0, 'reset_at' => 0];
        }
        return $decoded;
    });

    $now = time();
    if (!isset($state['reset_at']) || $now >= (int) $state['reset_at']) {
        $state = ['count' => 0, 'reset_at' => $now + $windowSeconds];
    }

    if ($state['count'] >= $maxRequests) {
        jsonResponse([
            'error' => 'rate_limited',
            'message' => 'Too many requests. Please try again later.',
        ], 429);
    }

    $state['count']++;

    withFileLock($path, function ($handle) use ($state) {
        if ($handle === null) {
            return null;
        }
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($state));
        return null;
    });
}

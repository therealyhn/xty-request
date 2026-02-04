<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env('DB_HOST');
    $name = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASS');

    if (!$host || !$name || !$user) {
        jsonResponse([
            'error' => 'server_misconfigured',
            'message' => 'Database credentials are missing.',
        ], 500);
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $name);
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Throwable $e) {
        jsonResponse([
            'error' => 'db_connection_failed',
            'message' => 'Unable to connect to database.',
        ], 500);
    }

    return $pdo;
}

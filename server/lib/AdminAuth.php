<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function getAuthorizationHeader(): ?string
{
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim((string) $_SERVER['HTTP_AUTHORIZATION']);
    }

    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            return trim((string) $headers['Authorization']);
        }
    }

    return null;
}

function requireAdminAuth(): void
{
    $expectedUser = env('ADMIN_USER');
    $expectedPass = env('ADMIN_PASS');

    if (!$expectedUser || !$expectedPass) {
        jsonResponse([
            'error' => 'server_misconfigured',
            'message' => 'Admin credentials are missing.',
        ], 500);
    }

    $user = $_SERVER['PHP_AUTH_USER'] ?? null;
    $pass = $_SERVER['PHP_AUTH_PW'] ?? null;

    if ($user === null || $pass === null) {
        $auth = getAuthorizationHeader();
        if ($auth && stripos($auth, 'basic ') === 0) {
            $decoded = base64_decode(substr($auth, 6));
            if ($decoded !== false) {
                [$user, $pass] = array_pad(explode(':', $decoded, 2), 2, null);
            }
        }
    }

    if ($user !== $expectedUser || $pass !== $expectedPass) {
        header('WWW-Authenticate: Basic realm="XTY Requests Admin"');
        jsonResponse([
            'error' => 'unauthorized',
            'message' => 'Unauthorized.',
        ], 401);
    }
}

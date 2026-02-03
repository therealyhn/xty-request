<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

jsonResponse([
    'status' => 'ok',
    'message' => 'XTY Request Backend is running',
    'server_time' => date('Y-m-d H:i:s'),
    'env' => env('APP_ENV', 'unknown'),
]);

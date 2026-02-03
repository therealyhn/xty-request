<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function deezerSearchTracks(string $query, int $limit = 10): array
{
    $params = http_build_query([
        'q' => $query,
        'limit' => $limit,
    ]);

    $ch = curl_init('https://api.deezer.com/search?' . $params);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 12,
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $status < 200 || $status >= 300) {
        jsonResponse([
            'error' => 'deezer_search_failed',
            'message' => 'Deezer search request failed.',
        ], 502);
    }

    $data = json_decode($response, true);
    if (!is_array($data) || !isset($data['data']) || !is_array($data['data'])) {
        jsonResponse([
            'error' => 'deezer_response_invalid',
            'message' => 'Deezer search response was invalid.',
        ], 502);
    }

    return $data['data'];
}

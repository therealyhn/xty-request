<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function getSpotifyAccessToken(): string
{
    $cachePath = __DIR__ . '/../storage/spotify_token.json';

    $cached = withFileLock($cachePath, function ($handle) {
        if ($handle === null) {
            return null;
        }
        $contents = stream_get_contents($handle);
        if ($contents === false || trim($contents) === '') {
            return null;
        }
        $decoded = json_decode($contents, true);
        if (!is_array($decoded)) {
            return null;
        }
        return $decoded;
    });

    $now = time();
    if (is_array($cached) && isset($cached['access_token'], $cached['expires_at'])) {
        if ($now < (int) $cached['expires_at']) {
            return (string) $cached['access_token'];
        }
    }

    $clientId = env('SPOTIFY_CLIENT_ID');
    $clientSecret = env('SPOTIFY_CLIENT_SECRET');
    if (!$clientId || !$clientSecret) {
        jsonResponse([
            'error' => 'server_misconfigured',
            'message' => 'Spotify credentials are missing on the server.',
        ], 500);
    }

    $auth = base64_encode($clientId . ':' . $clientSecret);
    $ch = curl_init('https://accounts.spotify.com/api/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Basic ' . $auth,
            'Content-Type: application/x-www-form-urlencoded',
        ],
        CURLOPT_POSTFIELDS => http_build_query(['grant_type' => 'client_credentials']),
        CURLOPT_TIMEOUT => 12,
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $status < 200 || $status >= 300) {
        jsonResponse([
            'error' => 'token_request_failed',
            'message' => 'Failed to obtain Spotify access token.',
        ], 502);
    }

    $data = json_decode($response, true);
    if (!is_array($data) || empty($data['access_token']) || empty($data['expires_in'])) {
        jsonResponse([
            'error' => 'token_response_invalid',
            'message' => 'Spotify token response was invalid.',
        ], 502);
    }

    $expiresAt = $now + (int) $data['expires_in'] - 30;
    $payload = [
        'access_token' => $data['access_token'],
        'expires_at' => $expiresAt,
    ];

    withFileLock($cachePath, function ($handle) use ($payload) {
        if ($handle === null) {
            return null;
        }
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($payload));
        return null;
    });

    return (string) $data['access_token'];
}

function spotifySearchTracks(string $query, int $limit = 10): array
{
    $token = getSpotifyAccessToken();

    $params = http_build_query([
        'q' => $query,
        'type' => 'track',
        'limit' => $limit,
    ]);

    $ch = curl_init('https://api.spotify.com/v1/search?' . $params);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 12,
    ]);

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $status < 200 || $status >= 300) {
        jsonResponse([
            'error' => 'spotify_search_failed',
            'message' => 'Spotify search request failed.',
        ], 502);
    }

    $data = json_decode($response, true);
    if (!is_array($data)) {
        jsonResponse([
            'error' => 'spotify_response_invalid',
            'message' => 'Spotify search response was invalid.',
        ], 502);
    }

    return $data;
}

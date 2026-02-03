<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

$query = $_GET['q'] ?? '';

if (trim($query) === '') {
    jsonResponse(['error' => 'Query parameter "q" is required'], 400);
}

// Basic Rate Limiting: 30 requests per minute per IP for search
rateLimit('search_' . getClientIp(), 30, 60);

$deezerUrl = 'https://api.deezer.com/search?q=' . urlencode($query);

// Use curl for better control/performance than file_get_contents
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $deezerUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// Deezer might require a user agent
curl_setopt($ch, CURLOPT_USERAGENT, 'XTYRequests/1.0');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false || $httpCode !== 200) {
    curl_close($ch);
    jsonResponse(['error' => 'Failed to fetch from Deezer', 'details' => curl_error($ch)], 502);
}

curl_close($ch);

$data = json_decode($response, true);

// Return purely the search results to the frontend, minimal transform if needed
// For now, pass through the Deezer structure to keep it flexible
jsonResponse($data);

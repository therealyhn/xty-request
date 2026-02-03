const DEFAULT_LIMIT = 10;

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || '';
}

export async function searchDeezer(query, options = {}) {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const limit = Number.isInteger(options.limit) ? options.limit : DEFAULT_LIMIT;
  const params = new URLSearchParams({
    q: trimmed,
    limit: String(limit),
  });

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/server/api/deezer/search.php?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    signal: options.signal,
  });

  if (!response.ok) {
    const error = new Error('Deezer search failed.');
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error('Deezer response invalid.');
  }

  return payload.data;
}

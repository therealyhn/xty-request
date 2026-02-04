export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || '';
}

export function buildApiUrl(path) {
  const base = getApiBaseUrl();
  return `${base}${path}`;
}

import { buildApiUrl } from './base.js';

export async function createRequest(payload, options = {}) {
  const url = buildApiUrl('/server/api/requests/create.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!response.ok) {
    const error = new Error('Request submission failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

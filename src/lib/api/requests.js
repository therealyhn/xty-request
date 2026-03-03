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
    let message = 'Request submission failed.';
    let retrySeconds = null;
    try {
      const payload = await response.json();
      if (payload && typeof payload.message === 'string') {
        message = payload.message;
      }
      if (payload && typeof payload.retry_seconds === 'number') {
        retrySeconds = payload.retry_seconds;
      }
    } catch {
      // keep default message
    }
    const error = new Error(message);
    error.status = response.status;
    error.retrySeconds = retrySeconds;
    throw error;
  }

  return response.json();
}

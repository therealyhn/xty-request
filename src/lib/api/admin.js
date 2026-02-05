import { buildApiUrl } from './base.js';

function buildAuthHeader(username, password) {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
}

export async function fetchRequests({ username, password, status }) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const url = buildApiUrl(`/server/api/admin/requests.php?${params.toString()}`);

  const response = await fetch(url, {
    headers: {
      Authorization: buildAuthHeader(username, password),
    },
  });

  if (!response.ok) {
    const error = new Error('Admin fetch failed.');
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function updateRequestStatus({ username, password, id, status }) {
  const url = buildApiUrl('/server/api/admin/update-status.php');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    const error = new Error('Admin update failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function fetchNightCode({ username, password }) {
  const url = buildApiUrl('/server/api/admin/night-code.php');
  const response = await fetch(url, {
    headers: {
      Authorization: buildAuthHeader(username, password),
    },
  });

  if (!response.ok) {
    const error = new Error('Night code fetch failed.');
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  return payload?.data?.night_code || '';
}

export async function updateNightCode({ username, password, nightCode }) {
  const url = buildApiUrl('/server/api/admin/night-code.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ night_code: nightCode }),
  });

  if (!response.ok) {
    const error = new Error('Night code update failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

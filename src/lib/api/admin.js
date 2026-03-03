import { buildApiUrl } from './base.js';

function buildAuthHeader(username, password) {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
}

export async function fetchRequests({ username, password, status, eventId }) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (eventId) params.set('event_id', String(eventId));
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

export async function fetchEvents({ username, password }) {
  const url = buildApiUrl('/server/api/admin/events.php');
  const response = await fetch(url, {
    headers: {
      Authorization: buildAuthHeader(username, password),
    },
  });

  if (!response.ok) {
    const error = new Error('Event fetch failed.');
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  return {
    events: Array.isArray(payload.data) ? payload.data : [],
    activeEventId: Number(payload.active_event_id || 0),
  };
}

export async function createEvent({ username, password, name }) {
  const url = buildApiUrl('/server/api/admin/events.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'create', name }),
  });

  if (!response.ok) {
    const error = new Error('Event creation failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function setActiveEvent({ username, password, eventId }) {
  const url = buildApiUrl('/server/api/admin/events.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'set_active', event_id: eventId }),
  });

  if (!response.ok) {
    const error = new Error('Set active event failed.');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function renameEvent({ username, password, eventId, name }) {
  const url = buildApiUrl('/server/api/admin/events.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'rename', event_id: eventId, name }),
  });

  if (!response.ok) {
    let message = 'Rename event failed.';
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch (_) {
      // Ignore parse errors and keep fallback message.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function deleteEvent({ username, password, eventId }) {
  const url = buildApiUrl('/server/api/admin/events.php');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(username, password),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'delete', event_id: eventId }),
  });

  if (!response.ok) {
    let message = 'Delete event failed.';
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch (_) {
      // Ignore parse errors and keep fallback message.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
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

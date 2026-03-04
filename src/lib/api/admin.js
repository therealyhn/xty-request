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

export async function exportRequestsPdf({ username, password, eventId, eventName }) {
  const { jsPDF } = await import('jspdf');
  const rows = await fetchRequests({
    username,
    password,
    status: '',
    eventId,
  });

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 32;
  const columns = [
    { key: 'played', title: 'Pustena', width: 60 },
    { key: 'track_title', title: 'Pesma', width: 170 },
    { key: 'track_artist', title: 'Izvodjac', width: 120 },
    { key: 'message', title: 'Komentar', width: pageWidth - margin * 2 - 350 },
  ];

  const drawTableHeader = (y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    let x = margin;
    columns.forEach((col) => {
      doc.rect(x, y, col.width, 22);
      doc.text(col.title, x + 6, y + 14);
      x += col.width;
    });
    return y + 22;
  };

  const safeEventName = (eventName || `event-${eventId}`).trim();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`XTY Requests - ${safeEventName}`, margin, 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Ukupno zapisa: ${rows.length}`, margin, 48);

  let y = 60;
  y = drawTableHeader(y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  rows.forEach((row) => {
    const values = {
      played: row.status === 'played' ? 'DA' : 'NE',
      track_title: row.track_title || '',
      track_artist: row.track_artist || '',
      message: row.message || '-',
    };

    const wrapped = columns.map((col) => doc.splitTextToSize(String(values[col.key]), col.width - 10));
    const maxLines = Math.max(...wrapped.map((lines) => lines.length), 1);
    const rowHeight = maxLines * 12 + 8;

    if (y + rowHeight > pageHeight - margin) {
      doc.addPage();
      y = 32;
      y = drawTableHeader(y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }

    let x = margin;
    wrapped.forEach((lines, index) => {
      const width = columns[index].width;
      doc.rect(x, y, width, rowHeight);
      doc.text(lines, x + 6, y + 12);
      x += width;
    });

    y += rowHeight;
  });

  const filename = `requests_${safeEventName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'event'}.pdf`;
  doc.save(filename);
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

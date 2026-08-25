/**
 * API client — the only module that knows about HTTP/endpoints.
 * Every call returns the unwrapped `data` payload or throws an Error with a
 * clean message pulled from the backend's { success, error } envelope.
 */

const BASE = '/api';

/**
 * Shared fetch wrapper: parses the envelope and normalizes errors.
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>} the `data` field on success
 */
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // Network/connection-level failure (server down, offline, etc.)
    throw new Error('Unable to reach the server. Is the backend running?');
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response body; leave body as null.
  }

  if (!response.ok || !body || body.success === false) {
    const message = body?.error || `Request failed (${response.status}).`;
    throw new Error(message);
  }

  return body.data;
}

/** GET all subscriptions (each decorated with derived fields). */
export function fetchSubscriptions() {
  return request('/subscriptions');
}

/** GET dashboard metrics from the server (authoritative). */
export function fetchMetrics() {
  return request('/metrics');
}

/** POST a new subscription. */
export function addSubscription(payload) {
  return request('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** PATCH a subscription's status (ACTIVE | PAUSED). */
export function updateStatus(id, status) {
  return request(`/subscriptions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/** DELETE a subscription permanently. */
export function deleteSubscription(id) {
  return request(`/subscriptions/${id}`, { method: 'DELETE' });
}

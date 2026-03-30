/**
 * Thin fetch wrapper that:
 *  1. Adds the Authorization: Bearer <token> header automatically.
 *  2. After every response checks for the X-Refreshed-Token header sent by
 *     the backend's sliding-inactivity mechanism. If present, the new token
 *     is saved to localStorage so the 15-minute inactivity clock resets.
 */

const TOKEN_KEY = 'sc_access_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);

export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(url, { ...options, headers });

  // ── Sliding-window token refresh ──────────────────────────────────────────
  const refreshed = res.headers.get('X-Refreshed-Token');
  if (refreshed) {
    setToken(refreshed); // store fresh token → 15-min clock resets
  }

  return res;
}

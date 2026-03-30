// Base URL — set VITE_API_BASE_URL in your .env file
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * POST /api/auth/register
 * @param {{ fullName, email, phoneNumber, role, password }} data
 */
export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Registration failed.');
  return json; // { userId, email, role, message }
}

/**
 * POST /api/auth/login
 * @param {{ email, password }} data
 */
export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed.');
  return json; // { accessToken, refreshToken, tokenType, expiresIn, userId, role }
}

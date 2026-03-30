import { apiFetch } from './apiClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/** GET /api/portfolio — returns the user's holdings as DTOs */
export async function fetchPortfolio() {
  const res = await apiFetch(`${API_BASE}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolio.');
  return res.json();
}

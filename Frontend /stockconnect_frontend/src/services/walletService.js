import { apiFetch } from './apiClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/** GET /api/wallet */
export async function fetchWallet() {
  const res = await apiFetch(`${API_BASE}/wallet`);
  if (!res.ok) throw new Error('Failed to fetch wallet.');
  return res.json();
}

/** GET /api/wallet/transactions */
export async function fetchTransactions() {
  const res = await apiFetch(`${API_BASE}/wallet/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions.');
  return res.json();
}

/** POST /api/wallet/deposit */
export async function depositFunds(amount) {
  const res = await apiFetch(`${API_BASE}/wallet/deposit`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Deposit failed.');
  }
  return res.json();
}

/** POST /api/wallet/withdraw */
export async function withdrawFunds(amount) {
  const res = await apiFetch(`${API_BASE}/wallet/withdraw`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Withdrawal failed.');
  }
  return res.json();
}

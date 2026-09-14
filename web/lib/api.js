function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined') return `http://${window.location.hostname}:4000/api`;
  return 'http://127.0.0.1:4000/api';
}

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      ...options,
    });
  } catch {
    throw new Error('SafePay API is offline. Run “npm run dev” from the project root, then confirm http://localhost:4000/api/health opens.');
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'SafePay could not complete the request.');
  }
  return response.status === 204 ? null : response.json();
}

export const scanApi = {
  health: () => request('/health'),
  analyze: (payload) => request('/scans', { method: 'POST', body: JSON.stringify(payload) }),
  list: () => request('/scans'),
  remove: (id) => request(`/scans/${id}`, { method: 'DELETE' }),
};

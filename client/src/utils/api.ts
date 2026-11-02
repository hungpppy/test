// Gọi API cùng nguồn; cookie đăng nhập là httpOnly nên JavaScript không đọc được token.
export async function api<T = any>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const r = await fetch(url, { method, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: method === 'GET' ? undefined : JSON.stringify(body ?? {}) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Có lỗi xảy ra'); return d;
}

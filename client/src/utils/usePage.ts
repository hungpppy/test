import { useEffect, useState } from 'react'; import { api } from './api';
// Nội dung trang do admin chỉnh trong /quan-tri; chưa tải được thì dùng nội dung dự phòng
export function usePage(slug: string, fallback: { title: string; body: string[] }) {
  const [p, setP] = useState<{ title: string; body: string[] } | null>(null);
  useEffect(() => { api<{ title: string; body: string[] }>(`/api/pages/${slug}`).then(setP).catch(() => setP(null)); }, [slug]);
  return p ?? fallback;
}

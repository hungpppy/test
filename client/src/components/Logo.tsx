import { company } from '../config/company';
// Logo ghép Đông Bắc Technology Solution + HALOSUN (public/logo.png)
export default function Logo({ height = 52 }: { height?: number }) {
  return <img src="/logo.png" alt={`${company.partner} – ${company.name}, ${company.slogan}`} height={height} style={{ display: 'block', height, width: 'auto', borderRadius: 6 }} />;
}

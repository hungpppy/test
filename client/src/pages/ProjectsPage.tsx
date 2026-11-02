import { useEffect, useState } from 'react'; import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { fetchProjects } from '../store/contentSlice'; import { ProjectCards, fmtDate } from '../components/HomeFeeds';
export default function ProjectsPage() {
  const d = useAppDispatch(); const [tab, setTab] = useState(''); const projects = useAppSelector((s) => s.content.projects);
  useEffect(() => { d(fetchProjects()); }, [d]);
  const types = Array.from(new Set(projects.map((p) => p.type)));
  return (<><section className="pagehead"><h1>Dự án tiêu biểu</h1><p>Các công trình HALOSUN và Đông Bắc đã thực hiện</p></section>
    <section className="wrap wide"><div className="tabs">{['', ...types].map((k) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k || 'Tất cả'}</button>)}</div>
      <ProjectCards type={tab || undefined} /></section></>);
}
export function ProjectDetail() {
  const { id } = useParams(); const d = useAppDispatch(); const projects = useAppSelector((s) => s.content.projects);
  useEffect(() => { d(fetchProjects()); }, [d]);
  const p = projects.find((x) => String(x.id) === id);
  if (!p) return <section className="wrap"><p>{projects.length ? 'Không tìm thấy dự án.' : 'Đang tải…'}</p><Link className="ghost" to="/du-an">← Tất cả dự án</Link></section>;
  return (<section className="wrap article"><img className="pimg" src={p.image} alt={p.name} /><h1>{p.name}</h1><small>{p.location} · {fmtDate(p.date)}</small>
    <p>{p.summary}</p><p>Cần tư vấn hệ thống điện mặt trời cho công trình của bạn? HALOSUN khảo sát và báo giá theo nhu cầu thực tế.</p>
    <p><Link className="ghost" to="/lien-he">Nhận tư vấn & báo giá</Link> <Link className="ghost" to="/du-an">← Tất cả dự án</Link></p></section>);
}

import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { fetchNews, fetchProjects } from '../store/contentSlice';
export const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');
export function ProjectCards({ type, limit }: { type?: string; limit?: number }) {
  const list = useAppSelector((s) => s.content.projects).filter((p) => !type || p.type === type).slice(0, limit);
  return (<div className="pgrid">{list.map((p) => <article className="pcard" key={p.id}><img src={p.image} alt={p.name} loading="lazy" />
    <div className="pb"><h3>{p.name}</h3><p>{p.summary}</p><small>{fmtDate(p.date)}</small><Link className="ghost" to={`/du-an/${p.id}`}>Tiếp tục đọc →</Link></div></article>)}</div>);
}
export function ProjectsHome() {
  const d = useAppDispatch(); const projects = useAppSelector((s) => s.content.projects); const [tab, setTab] = useState('');
  useEffect(() => { d(fetchProjects()); }, [d]);
  const types = Array.from(new Set(projects.map((p) => p.type))); const cur = tab || types[0];
  return (<section id="du-an" className="band"><h2 className="title">Dự án tiêu biểu</h2>
    <div className="tabs center">{types.map((t) => <button key={t} className={cur === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
    <ProjectCards type={cur} limit={3} /><p className="center"><Link className="ghost" to="/du-an">Xem tất cả dự án</Link></p></section>);
}
export function NewsHome() {
  const d = useAppDispatch(); const news = useAppSelector((s) => s.content.news);
  useEffect(() => { d(fetchNews()); }, [d]);
  if (!news.length) return null;
  return (<section id="tin-tuc" className="wrap"><h2 className="title left">Tin tức năng lượng mặt trời</h2>
    <Link to={`/tin-tuc/${news[0].slug}`} className="featured"><h3>{news[0].title}</h3><small>{fmtDate(news[0].published_at)} · {news[0].source}</small><p>{news[0].summary}</p></Link>
    <ul className="news">{news.slice(1, 5).map((n) => <li key={n.slug}><Link to={`/tin-tuc/${n.slug}`}><b>{n.title}</b><small>{fmtDate(n.published_at)} · {n.source}</small></Link></li>)}</ul>
    <p><Link className="ghost" to="/tin-tuc">Xem tất cả tin tức</Link></p></section>);
}

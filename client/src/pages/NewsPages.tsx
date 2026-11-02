import { useEffect } from 'react'; import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { fetchArticle, fetchNews } from '../store/contentSlice'; import { fmtDate } from '../components/HomeFeeds';
export function NewsList() {
  const d = useAppDispatch(); const news = useAppSelector((s) => s.content.news);
  useEffect(() => { d(fetchNews()); }, [d]);
  return (<><section className="pagehead"><h1>Tin tức năng lượng mặt trời</h1><p>Cập nhật các chính sách, số liệu và thị trường điện mặt trời mới nhất</p></section><section className="wrap"><ul className="news">
    {news.map((n) => <li key={n.slug}><Link to={`/tin-tuc/${n.slug}`}><b>{n.title}</b><small>{fmtDate(n.published_at)} · {n.source}</small><span>{n.summary}</span></Link></li>)}</ul></section></>);
}
export function NewsDetail() {
  const { slug = '' } = useParams(); const d = useAppDispatch(); const { article, loading, error } = useAppSelector((s) => s.content);
  useEffect(() => { d(fetchArticle(slug)); }, [d, slug]);
  return (<section className="wrap article">
    {loading && <p>Đang tải…</p>}{error && <><h1>Không tìm thấy bài viết</h1><p>{error}</p></>}
    {article && <><h1>{article.title}</h1><small>{fmtDate(article.published_at)}</small>{article.body?.map((p, i) => <p key={i}>{p}</p>)}{article.url && <p>Đọc bài gốc tại <a href={article.url} target="_blank" rel="noopener noreferrer">{article.source}</a>. HALOSUN tóm tắt lại bằng lời của mình, nội dung đầy đủ thuộc về nguồn.</p>}</>}
    <p><Link className="ghost" to="/tin-tuc">← Tất cả tin tức</Link></p></section>);
}

import { Link, useParams } from 'react-router-dom'; import { COSTS } from '../config/catalog';
export default function InstallCost() {
  const { slug } = useParams(); const item = COSTS.find((c) => c.slug === slug);
  if (slug && !item) return <section className="wrap"><h1>Không tìm thấy gói lắp đặt</h1><Link className="ghost" to="/chi-phi-lap-dat">← Tất cả gói</Link></section>;
  if (!item) return (<><section className="pagehead"><h1>Chi phí lắp đặt</h1><p>Chọn loại hệ thống để xem thành phần và yếu tố ảnh hưởng chi phí</p></section>
    <section className="wrap"><div className="cards">{COSTS.map((c) => <article key={c.slug}><h3>{c.title}</h3><p>{c.intro}</p><Link className="ghost" to={`/chi-phi-lap-dat/${c.slug}`}>Xem chi tiết</Link></article>)}</div></section></>);
  return (<><section className="pagehead"><h1>{item.title}</h1><p>Chi phí lắp đặt</p></section>
    <section className="wrap article"><p>{item.intro}</p><p><b>Phù hợp với:</b> {item.suit}</p>
      <h2>Thành phần hệ thống</h2><ul>{item.parts.map((p) => <li key={p}>{p}</li>)}</ul>
      <h2>Yếu tố ảnh hưởng chi phí</h2><ul>{item.factors.map((p) => <li key={p}>{p}</li>)}</ul>
      <h2>Tham khảo từ báo chí (tổng hợp 01/11/2026)</h2>{item.prices.length ? <ul>{item.prices.map((x) => <li key={x.text}>{x.text} <a href={x.url} target="_blank" rel="noopener noreferrer">{x.source}</a></li>)}</ul> : <p>Chưa có số liệu giá công khai đáng tin cậy cho gói này. HALOSUN báo giá sau khi khảo sát.</p>}
      <p>Chi phí cụ thể phụ thuộc công suất và điều kiện mái nhà. Bạn có thể dùng công cụ tính toán để ước tính nhanh, báo giá chính thức sau khi khảo sát.</p>
      <p><Link className="ghost" to="/#tinh-toan">Tính chi phí ước tính</Link> <Link className="ghost" to="/lien-he">Nhận tư vấn & báo giá</Link></p></section></>);
}

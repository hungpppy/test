import { Link } from 'react-router-dom'; import { usePage } from '../utils/usePage'; import Stats from '../components/Stats'; import { stats } from '../config/data'; import { company as c } from '../config/company';
const values = [['Giải pháp phù hợp', 'Tính toán công suất theo hóa đơn điện và nhu cầu thực tế, không lắp thừa.'], ['Thiết bị rõ nguồn gốc', 'Làm việc với các hãng tấm pin, biến tần và pin lưu trữ phổ biến trên thị trường.'], ['Đồng hành lâu dài', 'Khảo sát, lắp đặt, nghiệm thu và bảo trì định kỳ trong cùng một đầu mối.']];
const steps = ['Khảo sát mái và hóa đơn điện', 'Thiết kế và báo giá', 'Thi công lắp đặt', 'Nghiệm thu và bảo trì'];
export default function About() {
  const pg = usePage('gioi-thieu', { title: '', body: [] });
  return (<><section className="pagehead"><h1>Giới thiệu {c.name}</h1><p>{c.slogan}</p></section>
    <section className="wrap"><h2>Về chúng tôi</h2>
      {pg.body.map((t) => <p key={t}>{t}</p>)}
      <p>📍 {c.address}<br />🕗 {c.hours}<br />📞 {c.phone} · ✉ {c.email}</p></section>
    <Stats items={stats} />
    <section className="band"><h2 className="title">Giá trị cốt lõi</h2><div className="cards">{values.map(([t, d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="wrap"><h2>Quy trình làm việc</h2><ol className="steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      <Link className="ghost" to="/lien-he">Nhận tư vấn & báo giá</Link></section></>);
}

import { Panel, SolutionArt } from './Art';
import { Link } from 'react-router-dom'; import { usePage } from '../utils/usePage'; import { solutions, partners } from '../config/data';
import { company as c } from '../config/company';
const open = () => document.getElementById('lien-he-nhanh')?.scrollIntoView({ behavior: 'smooth' });
export function Intro() {
  const pg = usePage('trang-chu-gioi-thieu', { title: 'Giải pháp điện mặt trời trọn gói', body: [] });
  return (<section id="gioi-thieu" className="intro"><div><h2>{c.name}</h2><h3>{pg.title}</h3>{pg.body.map((t) => <p key={t}>{t}</p>)}<Link className="ghost" to="/gioi-thieu">Xem chi tiết</Link></div>
    <div className="video">▶ Video giới thiệu</div></section>);
}
export const Solutions = () => (<section id="lap-dat" className="band"><h2 className="title">Giải pháp lắp đặt</h2>
  <div className="cards">{solutions.map((s, n) => <article key={s.t}><SolutionArt kind={n} /><h3>{s.t}</h3><p>{s.d}</p><button className="ghost" onClick={open}>Nhận tư vấn & báo giá</button></article>)}</div></section>);
export const Invest = () => (<section id="giai-phap" className="green"><h2 className="title" style={{ color: '#fff' }}>Giải pháp đầu tư</h2>
  <div className="duo">{[{ k: 'doanh-nghiep', icon: '🏢', who: 'Doanh nghiệp', t: 'Điện mặt trời cho doanh nghiệp', d: 'Giảm chi phí điện cho nhà xưởng, văn phòng, kho bãi.', b: 'Theo khảo sát' },
    { k: 'ho-gia-dinh', icon: '🏠', who: 'Hộ gia đình', t: 'Điện mặt trời cho hộ gia đình', d: 'Tiết kiệm tiền điện mỗi tháng, bảo vệ môi trường sống.', b: '3 – 5 năm' }].map((i) =>
    <article key={i.k}><span className="tag">{i.icon} {i.who}</span><h3>{i.t}</h3><p>{i.d}</p>
      <div className="nums"><div>Hình thức<b>Hòa lưới, hybrid</b></div><div>Hoàn vốn<b>{i.b}</b></div></div>
      <Link className="ghost" to={`/giai-phap-dau-tu/${i.k}`}>Xem chi tiết</Link></article>)}</div></section>);
export const Partners = () => (<section className="band"><h2 className="title">Đối tác chiến lược</h2><div className="logos">{partners.map((p) => <span key={p}>{p}</span>)}</div></section>);
export const FloatingContact = () => (<>
  <div className="float"><a href={`tel:${c.phone.replace(/\s/g, '')}`} title="Gọi">📞</a><a href={`mailto:${c.email}`} title="Email">✉</a><a href="/lien-he" title="Nhắn tin">💬</a></div>
  <a className="hotline" href={`tel:${c.phone.replace(/\s/g, '')}`}>📞 {c.phone}</a></>);

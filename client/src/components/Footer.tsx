import { company as c } from '../config/company';
const services = ['Tư vấn, khảo sát, thiết kế hệ thống điện mặt trời', 'Lắp đặt điện mặt trời áp mái hòa lưới', 'Lắp đặt điện mặt trời hòa lưới có lưu trữ (hybrid)', 'Lắp đặt điện mặt trời độc lập',
  'Cung cấp tấm pin, biến tần, pin lưu trữ và phụ kiện', 'Bảo trì, vệ sinh và giám sát hệ thống điện mặt trời'];
export default function Footer() {
  const tel = c.phone.replace(/\s/g, ''), tel2 = c.phone2.replace(/\s/g, '');
  return (<footer><div className="fcols">
    <div><img src="/logo.png" alt={`${c.partner} – ${c.name}`} height={64} style={{ borderRadius: 6, marginBottom: 14 }} /><h4>{c.legalName}</h4>
      <p>{c.name} là thương hiệu về năng lượng mặt trời, thuộc sở hữu của {c.legalName}.</p>
      <p>Công ty là nhà thầu bảo trì cơ điện thuộc top 1 tại Quảng Ninh, chuyên bảo trì, thi công cơ điện và năng lượng mặt trời với hàng trăm dự án lớn nhỏ tại khu vực Đông, Tây Bắc.</p></div>
    <div><h4>DỊCH VỤ NĂNG LƯỢNG MẶT TRỜI</h4>{services.map((s) => <p key={s}>{s}</p>)}</div>
    <div><h4>LIÊN HỆ</h4><p>📍 Địa chỉ: {c.address}</p><p>📞 Hotline: <a href={`tel:${tel}`}>{c.phone}</a> - <a href={`tel:${tel2}`}>{c.phone2}</a></p><p>✉ Email: <a href={`mailto:${c.email}`}>{c.email}</a></p><p>🕗 {c.hours}</p>
      <iframe title="Bản đồ HALOSUN" className="map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`} /></div></div>
    <small>Copyright {new Date().getFullYear()} © <b>{c.name}</b> · <a href="/nhan-vien" style={{ display: 'inline' }}>Dành cho nhân viên</a></small></footer>);
}

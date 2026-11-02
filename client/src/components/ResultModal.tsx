import { useEffect, useRef, useState, FormEvent } from 'react'; import { useAppDispatch, useAppSelector } from '../store/hooks'; import { submitLead } from '../store/leadSlice';
import type { CalcResult } from '../store/calcSlice'; 
const f = (n: number, d = 0) => n.toLocaleString('vi', { minimumFractionDigits: d, maximumFractionDigits: d });
export default function ResultModal({ r, onClose }: { r: CalcResult; onClose: () => void }) {
  const btn = useRef<HTMLButtonElement>(null); const dispatch = useAppDispatch(); const { status, error } = useAppSelector((x) => x.lead);
  const [name, setName] = useState(''); const [phone, setPhone] = useState('');
  const send = (e: FormEvent) => { e.preventDefault(); dispatch(submitLead({ name, phone, message: `Quan tâm hệ thống ${f(r.kwp, 2)} kWp, giá ước tính ${f(r.cost)} đ, tiền điện hiện tại ${f(r.bill)} đ/tháng` })); };
  useEffect(() => { btn.current?.focus(); const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k); }, [onClose]);
  const tier = (t: number) => `Bậc ${t + 1} (${f(r.prices[t])} đ/kWh)`;
  const row = (a: string, b: string, c: string) => <tr key={a}><td>{a}</td><td><b>{b}</b></td><td>{c}</td></tr>;
  return (<div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true"><div className="mbox">
    <div className="mh"><h2>KẾT QUẢ TÍNH TOÁN ĐIỆN MẶT TRỜI</h2><button ref={btn} onClick={onClose} aria-label="Đóng">×</button></div>
    <div className="mb"><section className="mc"><h3>📋 Đầu ra — Thông số hệ thống đề xuất</h3><table><tbody>
      {row('Công suất hệ thống phù hợp', f(r.kwp, 2), 'kWp')}{row('Sản lượng điện mặt trời hàng tháng', f(r.prod), 'kWh/tháng')}{row('Diện tích mái cần thiết', f(r.area), 'm²')}
      {row('Số lượng tấm pin dự kiến', String(r.panels), 'Tấm 620Wp')}{row('Công suất biến tần', String(r.inverter), 'kW')}
      {row('Giá hệ thống đề xuất (hòa lưới bám tải)', f(r.cost), 'VNĐ')}{row('Tiết kiệm hàng tháng', f(r.saving), 'VNĐ/tháng')}{row('Thời gian thu hồi vốn', f(r.payback, 1), 'Năm')}
      {row('Lượng CO₂ giảm phát thải', f(r.co2, 3), 'Tấn/năm')}{row('Tương đương trồng cây xanh', f(r.trees), 'Cây/năm')}</tbody></table></section>
    <section className="mc"><h3>📊 So sánh trước và sau khi lắp đặt</h3><table className="cmp"><thead><tr><th>THÔNG SỐ</th><th>TRƯỚC</th><th>SAU</th><th>THAY ĐỔI</th></tr></thead><tbody>
      <tr><td>Điện tiêu thụ từ lưới</td><td>{f(r.kwh0)} kWh</td><td>{f(r.kwh1)} kWh</td><td>-{f(r.offset)} kWh</td></tr>
      <tr><td>Tiền điện hàng tháng</td><td>{f(r.bill)}</td><td>{f(r.bill1)}</td><td>↓ Giảm {f(r.saving)}</td></tr>
      <tr><td>Bậc tiền điện</td><td>{tier(r.tier0)}</td><td>{tier(r.tier1)}</td><td>{r.tier1 < r.tier0 ? `Giảm xuống bậc ${r.tier1 + 1}` : 'Không đổi'}</td></tr>
      <tr><td>Tỷ lệ giảm tiền điện</td><td>0%</td><td>{f(r.pct, 1)}%</td><td>Tiết kiệm {f(r.pct, 1)}%</td></tr>
      <tr className="tot"><td colSpan={3}>💡 Tổng tiết kiệm mỗi năm</td><td>{f(r.year)} VNĐ/năm</td></tr></tbody></table></section>
    <form className="mlead" onSubmit={send}><input placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} required /><input placeholder="Số điện thoại (10 số)" value={phone} onChange={(e) => setPhone(e.target.value)} required /><button disabled={status === 'sending'}>Nhận báo giá chính xác</button></form>
    {status === 'ok' && <p className="ok">Đã nhận thông tin. HALOSUN sẽ gọi lại sớm.</p>}{status === 'error' && <p className="err">{error}</p>}
    <p className="mn">Tính theo biểu giá điện sinh hoạt EVN (QĐ 1279/QĐ-BCT, 6 bậc, VAT 8%). Số liệu chỉ mang tính tham khảo.</p></div></div></div>);
}

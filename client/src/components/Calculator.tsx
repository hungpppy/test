import { useState } from 'react'; import { vnd } from '../utils/format';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { calculate, reset } from '../store/calcSlice'; import ResultModal from './ResultModal';
export default function Calculator() {
  const [bill, setBill] = useState(2500000); const [dayRatio, setDay] = useState(70); const [roof, setRoof] = useState('ton'); const [place, setPlace] = useState('Quảng Ninh');
  const { result, loading } = useAppSelector((s) => s.calc); const dispatch = useAppDispatch();
  return (<section className="calc" id="tinh-toan"><h2>Công cụ tính toán điện mặt trời</h2><p className="sub2">Hệ thống hòa lưới bám tải</p>
    <label>Tiền điện hàng tháng (VNĐ)<input type="number" value={bill} onChange={(e) => setBill(+e.target.value)} /></label>
    <label>📍 Địa điểm lắp đặt<select value={place} onChange={(e) => setPlace(e.target.value)}>{['Quảng Ninh','Hải Phòng','Hà Nội','Đà Nẵng','TP. Hồ Chí Minh'].map((x) => <option key={x}>{x}</option>)}</select></label>
    <label>Loại mái<select value={roof} onChange={(e) => setRoof(e.target.value)}><option value="ton">Mái tôn</option><option value="ngoi">Mái ngói</option></select></label>
    <label>Dùng điện ban ngày: {dayRatio}%<input type="range" min={10} max={100} value={dayRatio} onChange={(e) => setDay(+e.target.value)} /></label>
    <button onClick={() => dispatch(calculate({ bill, dayRatio, roof, place }))} disabled={loading}>{loading ? 'Đang tính…' : 'Tính toán ngay'}</button>
    {result && <ResultModal r={result} onClose={() => dispatch(reset())} />}
    <small className="note">* Số liệu chỉ mang tính chất tham khảo</small></section>);
}

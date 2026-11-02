import { useEffect, useState, FormEvent } from 'react'; import { Link, useParams } from 'react-router-dom';
import { INVEST } from '../config/catalog'; import { api } from '../utils/api'; import { SolutionArt } from '../components/Art';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { calculate, reset } from '../store/calcSlice'; import ResultModal from '../components/ResultModal';
import { fetchProjects } from '../store/contentSlice'; import { ProjectCards } from '../components/HomeFeeds';
const PLACES = ['Quảng Ninh', 'Hải Phòng', 'Hà Nội', 'Đà Nẵng', 'TP. Hồ Chí Minh'];
interface Pkg { kwp: number; panels: number; gen: number; saving: number }
interface Biz { kwp: number; panels: number; inverter: number; gen: number; costMin: number; costMax: number; co2: number; trees: number }
const f = (n: number, d = 0) => n.toLocaleString('vi', { minimumFractionDigits: d, maximumFractionDigits: d });
export default function GiaiPhapDauTu() {
  const { kind = '' } = useParams(); const data = INVEST[kind]; const biz = kind === 'doanh-nghiep';
  const d = useAppDispatch(); const result = useAppSelector((s) => s.calc.result); const loading = useAppSelector((s) => s.calc.loading);
  const [pk, setPk] = useState<Pkg[]>([]); const [place, setPlace] = useState('Quảng Ninh'); const [bill, setBill] = useState('2500000'); const [area, setArea] = useState('1000'); const [use, setUse] = useState('Sản xuất');
  const [br, setBr] = useState<Biz | null>(null); const [err, setErr] = useState('');
  useEffect(() => { d(fetchProjects()); if (!biz) api<Pkg[]>('/api/packages').then(setPk).catch(() => setPk([])); }, [d, biz]);
  if (!data) return <section className="wrap"><h1>Không tìm thấy trang</h1></section>;
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr('');
    if (biz) { try { setBr(await api<Biz>('/api/calc-business', 'POST', { area: Number(area), place })); } catch (x: any) { setErr(x.message); } }
    else d(calculate({ bill: Number(bill), dayRatio: 50, roof: 'ton', place })); };
  const ids = [['gioi-thieu', 'GIỚI THIỆU'], [biz ? 'loi-ich' : 'goi', biz ? 'LỢI ÍCH KINH TẾ' : 'CÁC GÓI GIẢI PHÁP'], ['du-toan', 'DỰ TOÁN HỆ THỐNG'], ['du-an-tieu-bieu', 'DỰ ÁN TIÊU BIỂU'], ['ly-do', 'LÝ DO CHỌN HALOSUN']];
  return (<>
    <section className="pagehead"><h1>{biz ? 'Doanh nghiệp' : 'Hộ gia đình'}</h1><p>Trang chủ › Giải pháp đầu tư › {biz ? 'Doanh nghiệp' : 'Hộ gia đình'}</p></section>
    <nav className="subnav" aria-label="Mục trong trang">{ids.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
    <section id="gioi-thieu" className="sky"><div className="skyl"><h2>{data.title.toUpperCase()}</h2>{data.intro.map((p) => <p key={p}>{p}</p>)}<Link className="cta big" to="/lien-he">NHẬN TƯ VẤN VÀ BÁO GIÁ →</Link></div><div className="skyr"><SolutionArt kind={biz ? 1 : 0} /></div></section>
    {biz ? <section id="loi-ich" className="wrap wide"><h2 className="title">Điện mặt trời đầu tư một lần, lợi ích nhiều năm</h2><div className="benefits">{data.benefits.map((b) => <article key={b.t}><h3>{b.t}</h3><p>{b.d}</p></article>)}</div></section>
      : <section id="goi" className="wrap wide"><h2 className="title">Các gói giải pháp</h2><p className="center">Ước tính cho khu vực Quảng Ninh khi 50% điện dùng vào ban ngày</p>
        <div className="pkgs">{pk.map((p) => <article key={p.kwp}><dl><dt>CÔNG SUẤT</dt><dd>{p.kwp} kWp</dd><dt>SỐ TẤM PIN</dt><dd>{p.panels}</dd><dt>ĐIỆN TẠO RA</dt><dd>{f(p.gen)} kWh/tháng</dd><dt>TIỀN ĐIỆN TIẾT KIỆM</dt><dd>{f(p.saving)} đ/tháng</dd></dl>
          <Link className="cta" to="/lien-he">NHẬN TƯ VẤN VÀ BÁO GIÁ →</Link></article>)}</div></section>}
    <section id="du-toan" className="est"><form onSubmit={submit}><h2>DỰ TOÁN HỆ THỐNG</h2>
      <label>Khu vực lắp đặt<select value={place} onChange={(e) => setPlace(e.target.value)}>{PLACES.map((x) => <option key={x}>{x}</option>)}</select></label>
      {biz ? <><label>Diện tích mái muốn lắp đặt (m²)<input type="number" min={20} value={area} onChange={(e) => setArea(e.target.value)} required /></label>
        <label>Loại hình sử dụng điện<select value={use} onChange={(e) => setUse(e.target.value)}>{['Sản xuất', 'Kinh doanh', 'Văn phòng', 'Kho bãi'].map((x) => <option key={x}>{x}</option>)}</select></label></>
        : <label>Số tiền điện mỗi tháng (VNĐ, đã gồm VAT)<input type="number" min={100000} value={bill} onChange={(e) => setBill(e.target.value)} required /></label>}
      {err && <p className="err" role="alert">{err}</p>}<button className="cta big" disabled={loading}>XEM KẾT QUẢ</button><small>Số liệu chỉ mang tính tham khảo.</small></form></section>
    <section id="du-an-tieu-bieu" className="band"><h2 className="title">Dự án tiêu biểu</h2><ProjectCards limit={3} /><p className="center"><Link className="ghost" to="/du-an">Xem tất cả dự án</Link></p></section>
    <section id="ly-do" className="wrap"><h2 className="title">Lý do chọn {`HALOSUN`}</h2><ul className="why">{data.whyUs.map((w) => <li key={w}>{w}</li>)}</ul>
      <h3>Quy trình làm việc</h3><ol className="steps">{data.steps.map((s) => <li key={s}>{s}</li>)}</ol></section>
    {result && <ResultModal r={result} onClose={() => d(reset())} />}
    {br && <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setBr(null)}><div className="mbox"><div className="mh"><h2>DỰ TOÁN CHO DOANH NGHIỆP ({use.toUpperCase()})</h2><button onClick={() => setBr(null)} aria-label="Đóng">×</button></div>
      <div className="mb"><section className="mc"><table><tbody>
        <tr><td>Công suất hệ thống phù hợp</td><td><b>{f(br.kwp, 1)}</b></td><td>kWp</td></tr><tr><td>Số lượng tấm pin dự kiến</td><td><b>{f(br.panels)}</b></td><td>Tấm 620Wp</td></tr>
        <tr><td>Công suất biến tần</td><td><b>{f(br.inverter)}</b></td><td>kW</td></tr><tr><td>Sản lượng điện mặt trời hằng tháng</td><td><b>{f(br.gen)}</b></td><td>kWh/tháng</td></tr>
        <tr><td>Chi phí đầu tư ước tính</td><td><b>{f(br.costMin / 1e6)} – {f(br.costMax / 1e6)}</b></td><td>triệu đồng</td></tr>
        <tr><td>Lượng CO₂ giảm phát thải</td><td><b>{f(br.co2, 1)}</b></td><td>tấn/năm</td></tr><tr><td>Tương đương trồng mới</td><td><b>{f(br.trees)}</b></td><td>cây xanh/năm</td></tr></tbody></table></section>
        <p className="mn">Ước tính khoảng 8 m² mái cho mỗi kWp và 7,5–9 triệu đồng/kWp. Tiền điện tiết kiệm của doanh nghiệp phụ thuộc biểu giá và đồ thị phụ tải, HALOSUN tính sau khi khảo sát.</p>
        <Link className="cta big" to="/lien-he">NHẬN TƯ VẤN VÀ BÁO GIÁ CHÍNH XÁC</Link></div></div></div>}</>);
}

import { useEffect, useState } from 'react'; import { useSearchParams } from 'react-router-dom'; import { Panel } from '../components/Art'; import { CATS } from '../config/catalog';
interface P { id: number; category: string; sub: string; name: string; image?: string; description?: string }
// embedded = đặt trong trang chủ (dùng state); ngược lại đọc ?loai=&nhom= từ địa chỉ
export default function Products({ embedded = false }: { embedded?: boolean }) {
  const [list, setList] = useState<P[]>([]); const [sp, setSp] = useSearchParams(); const [st, setSt] = useState({ loai: 'panel', nhom: '' });
  const loai = embedded ? st.loai : sp.get('loai') || 'panel', nhom = embedded ? st.nhom : sp.get('nhom') || '';
  const go = (l: string, n = '') => embedded ? setSt({ loai: l, nhom: n }) : setSp(n ? { loai: l, nhom: n } : { loai: l });
  useEffect(() => { fetch('/api/products').then((r) => r.json()).then(setList).catch(() => setList([])); }, []);
  const cat = CATS.find((c) => c.key === loai) || CATS[0]; const items = list.filter((p) => p.category === cat.key && (!nhom || p.sub === nhom));
  const body = (<><div className="tabs">{CATS.map((c) => <button key={c.key} className={c.key === cat.key ? 'on' : ''} onClick={() => go(c.key)}>{c.label}</button>)}</div>
    {cat.subs && <div className="chips">{[{ key: '', label: 'Tất cả' }, ...cat.subs].map((s) => <button key={s.key} className={s.key === nhom ? 'on' : ''} onClick={() => go(cat.key, s.key)}>{s.label}</button>)}</div>}
    <ul className="grid">{items.map((p) => <li key={p.id}><div className="ph">{p.image ? <img src={p.image} alt={p.name} loading="lazy" /> : <Panel w={100} />}</div>{p.name}<button className="ghost">Đọc tiếp</button></li>)}</ul>
    {!items.length && <p>Đang cập nhật sản phẩm.</p>}</>);
  return embedded ? <section id="san-pham" className="wrap"><h2>Sản phẩm nổi bật</h2>{body}</section>
    : <><section className="pagehead"><h1>{cat.label}</h1><p>Sản phẩm HALOSUN</p></section><section className="wrap">{body}</section></>;
}

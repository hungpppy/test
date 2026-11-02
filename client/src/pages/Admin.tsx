import { useEffect, useState, FormEvent } from 'react'; import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks'; import { api } from '../utils/api'; import { CATS } from '../config/catalog'; import { Users, Leads } from './Account';
type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'select' | 'image' | 'date'; options?: [string, string][]; req?: boolean };
type Item = Record<string, any>;
async function upload(file: File): Promise<string> {
  const r = await fetch('/api/admin/upload', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Không tải được ảnh'); return d.url;
}
// Danh sách + thêm + sửa + xóa dùng chung cho sản phẩm, tin tức, dự án
function Crud({ fields, list, base, idKey, label, blank, detail }: { fields: Field[]; list: string; base: string; idKey: string; label: (i: Item) => string; blank: Item; detail?: (i: Item) => Promise<Item> }) {
  const [items, setItems] = useState<Item[]>([]); const [form, setForm] = useState<Item>(blank); const [editing, setEditing] = useState<string | number | null>(null); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  const load = () => api<Item[]>(list).then(setItems).catch((e) => setErr(e.message)); useEffect(() => { load(); }, [list]);
  const toForm = (i: Item): Item => Object.fromEntries(fields.map((f) => [f.key, Array.isArray(i[f.key]) ? i[f.key].join('\n\n') : String(i[f.key] ?? '')]));
  const edit = async (i: Item) => { setErr(''); setMsg(''); const full = detail ? await detail(i) : i; setForm(toForm(full)); setEditing(i[idKey]); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const reset = () => { setForm(blank); setEditing(null); };
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr(''); setMsg('');
    try { editing === null ? await api(base, 'POST', form) : await api(`${base}/${editing}`, 'PATCH', form); setMsg('Đã lưu.'); reset(); load(); } catch (x: any) { setErr(x.message); } };
  const del = async (i: Item) => { if (!confirm(`Xóa "${label(i)}"?`)) return; try { await api(`${base}/${i[idKey]}`, 'DELETE'); load(); } catch (x: any) { setErr(x.message); } };
  const pick = async (key: string, file?: File) => { if (!file) return; setErr(''); try { setForm({ ...form, [key]: await upload(file) }); } catch (x: any) { setErr(x.message); } };
  return (<>
    <form className="adform" onSubmit={submit}><h3>{editing === null ? 'Thêm mới' : 'Đang sửa'}</h3>
      {fields.map((f) => <label key={f.key}>{f.label}
        {f.type === 'textarea' ? <textarea rows={6} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.req} />
          : f.type === 'select' ? <select value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>{f.options!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          : f.type === 'image' ? <span className="imgf">{form[f.key] && <img src={form[f.key]} alt="" />}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => pick(f.key, e.target.files?.[0])} /></span>
          : <input type={f.type === 'date' ? 'date' : 'text'} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.req} />}</label>)}
      {err && <p className="err" role="alert">{err}</p>}{msg && <p className="ok">{msg}</p>}
      <div className="row"><button>{editing === null ? 'Thêm' : 'Lưu thay đổi'}</button>{editing !== null && <button type="button" className="linkbtn" onClick={reset}>Hủy sửa</button>}</div></form>
    <div className="sc"><table className="tbl"><tbody>{items.map((i) => <tr key={i[idKey]}><td>{i.image && <img className="thumb" src={i.image} alt="" />}</td><td>{label(i)}</td>
      <td><button className="linkbtn" onClick={() => edit(i)}>Sửa</button> <button className="linkbtn" onClick={() => del(i)}>Xóa</button></td></tr>)}</tbody></table></div></>);
}
const PAGES: [string, string][] = [['gioi-thieu', 'Trang Giới thiệu'], ['trang-chu-gioi-thieu', 'Giới thiệu ở trang chủ']];
function PagesEditor() {
  const [slug, setSlug] = useState(PAGES[0][0]); const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [msg, setMsg] = useState(''); const [err, setErr] = useState('');
  useEffect(() => { setMsg(''); setErr(''); api<{ title: string; body: string[] }>(`/api/pages/${slug}`).then((p) => { setTitle(p.title); setBody(p.body.join('\n\n')); }).catch((e) => setErr(e.message)); }, [slug]);
  const save = async (e: FormEvent) => { e.preventDefault(); setErr(''); setMsg(''); try { await api(`/api/admin/pages/${slug}`, 'PUT', { title, body }); setMsg('Đã lưu.'); } catch (x: any) { setErr(x.message); } };
  return (<form className="adform" onSubmit={save}><label>Chọn trang<select value={slug} onChange={(e) => setSlug(e.target.value)}>{PAGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
    <label>Tiêu đề<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
    <label>Nội dung (mỗi đoạn cách nhau một dòng trống)<textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} required /></label>
    {err && <p className="err" role="alert">{err}</p>}{msg && <p className="ok">{msg}</p>}<div className="row"><button>Lưu trang</button></div></form>);
}
const today = () => new Date().toISOString().slice(0, 10);
const subs: [string, string][] = [['', '(không có)'], ...CATS.flatMap((c) => (c.subs || []).map((s) => [s.key, `${c.label} › ${s.label}`] as [string, string]))];
const TABS = ['Sản phẩm', 'Tin tức', 'Dự án', 'Trang', 'Tài khoản', 'Yêu cầu tư vấn'] as const;
export default function Admin() {
  const { user, ready } = useAppSelector((s) => s.auth); const [tab, setTab] = useState<(typeof TABS)[number]>('Sản phẩm');
  if (!ready) return <section className="wrap"><p>Đang tải…</p></section>;
  if (!user || user.role !== 'admin') return <Navigate to="/nhan-vien" replace />;
  return (<><section className="pagehead"><h1>Quản trị website</h1><p>Chỉ quản trị viên. Mọi thay đổi hiện ngay trên website.</p></section>
    <section className="wrap wide"><div className="tabs">{TABS.map((t) => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === 'Sản phẩm' && <Crud list="/api/products" base="/api/admin/products" idKey="id" label={(i) => `${i.name} (${i.category}${i.sub ? ' › ' + i.sub : ''})`} blank={{ category: 'panel', sub: '', name: '', image: '', description: '' }}
        fields={[{ key: 'category', label: 'Nhóm', type: 'select', options: CATS.map((c) => [c.key, c.label]) }, { key: 'sub', label: 'Nhóm con (chỉ cho biến tần và phụ kiện)', type: 'select', options: subs }, { key: 'name', label: 'Tên sản phẩm', req: true }, { key: 'image', label: 'Ảnh sản phẩm', type: 'image' }, { key: 'description', label: 'Mô tả', type: 'textarea' }]} />}
      {tab === 'Tin tức' && <Crud list="/api/news" base="/api/admin/news" idKey="slug" label={(i) => `${i.published_at} · ${i.title}`} blank={{ title: '', summary: '', body: '', date: today(), source: '', url: '' }}
        detail={async (i) => { const n = await api<Item>(`/api/news/${i.slug}`); return { ...n, date: n.published_at }; }}
        fields={[{ key: 'title', label: 'Tiêu đề', req: true }, { key: 'summary', label: 'Tóm tắt', type: 'textarea' }, { key: 'body', label: 'Nội dung (mỗi đoạn cách nhau một dòng trống)', type: 'textarea', req: true }, { key: 'date', label: 'Ngày đăng', type: 'date', req: true }, { key: 'source', label: 'Tên nguồn (nếu có)' }, { key: 'url', label: 'Link bài gốc (nếu có)' }]} />}
      {tab === 'Dự án' && <Crud list="/api/projects" base="/api/admin/projects" idKey="id" label={(i) => `${i.name} (${i.type})`} blank={{ name: '', type: 'Khách sạn & Resort', location: '', summary: '', image: '', date: today() }}
        fields={[{ key: 'name', label: 'Tên dự án', req: true }, { key: 'type', label: 'Nhóm (vd: Khách sạn & Resort, Tòa nhà & Thương mại, Nhà xưởng)', req: true }, { key: 'location', label: 'Địa điểm' }, { key: 'summary', label: 'Mô tả', type: 'textarea' }, { key: 'image', label: 'Ảnh dự án', type: 'image' }, { key: 'date', label: 'Ngày', type: 'date', req: true }]} />}
      {tab === 'Trang' && <PagesEditor />}{tab === 'Tài khoản' && <Users meId={user.id} />}{tab === 'Yêu cầu tư vấn' && <Leads url="/api/leads" editable />}</section></>);
}

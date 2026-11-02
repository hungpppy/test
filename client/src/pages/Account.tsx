import { useEffect, useState, FormEvent } from 'react'; import { Link, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks'; import { api } from '../utils/api'; import type { Role } from '../store/authSlice';
const ROLE: Record<Role, string> = { admin: 'Quản trị viên', nhan_vien: 'Nhân viên', khach_hang: 'Khách hàng' };
const ST: Record<string, string> = { moi: 'Mới', da_goi: 'Đã gọi', da_bao_gia: 'Đã báo giá', hoan_thanh: 'Hoàn thành', huy: 'Hủy' };
interface Lead { id: number; name: string; phone: string; message: string; status: string; created_at: string }
interface Row { id: number; name: string; email: string; phone: string; role: Role; active: number; provider: string | null }
export function Leads({ url, editable }: { url: string; editable: boolean }) {
  const [rows, setRows] = useState<Lead[]>([]); const [err, setErr] = useState('');
  useEffect(() => { api<Lead[]>(url).then(setRows).catch((e) => setErr(e.message)); }, [url]);
  const set = async (id: number, status: string) => { try { await api(`/api/leads/${id}`, 'PATCH', { status }); setRows((r) => r.map((x) => x.id === id ? { ...x, status } : x)); } catch (e: any) { setErr(e.message); } };
  return (<div className="sc">{err && <p className="err">{err}</p>}<table className="tbl"><thead><tr><th>Ngày</th><th>Họ tên</th><th>Điện thoại</th><th>Nội dung</th><th>Trạng thái</th></tr></thead><tbody>
    {rows.map((r) => <tr key={r.id}><td>{new Date(r.created_at + 'Z').toLocaleDateString('vi-VN')}</td><td>{r.name}</td><td>{r.phone}</td><td>{r.message}</td>
      <td>{editable ? <select value={r.status} onChange={(e) => set(r.id, e.target.value)}>{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select> : ST[r.status] || r.status}</td></tr>)}
    {!rows.length && <tr><td colSpan={5}>Chưa có yêu cầu nào.</td></tr>}</tbody></table></div>);
}
export function Users({ meId }: { meId: number }) {
  const [rows, setRows] = useState<Row[]>([]); const [err, setErr] = useState(''); const [f, setF] = useState({ name: '', email: '', password: '', role: 'nhan_vien' });
  const load = () => api<Row[]>('/api/admin/users').then(setRows).catch((e) => setErr(e.message)); useEffect(() => { load(); }, []);
  const patch = async (id: number, body: object) => { setErr(''); try { await api(`/api/admin/users/${id}`, 'PATCH', body); load(); } catch (e: any) { setErr(e.message); } };
  const add = async (e: FormEvent) => { e.preventDefault(); setErr(''); try { await api('/api/admin/users', 'POST', f); setF({ name: '', email: '', password: '', role: 'nhan_vien' }); load(); } catch (x: any) { setErr(x.message); } };
  return (<>{err && <p className="err" role="alert">{err}</p>}
    <form className="mlead" onSubmit={add}><input placeholder="Họ tên" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /><input type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
      <input type="password" placeholder="Mật khẩu (từ 8 ký tự)" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} minLength={8} required />
      <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{Object.entries(ROLE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><button>Tạo tài khoản</button></form>
    <div className="sc"><table className="tbl"><thead><tr><th>Họ tên</th><th>Email</th><th>Nguồn</th><th>Vai trò</th><th>Trạng thái</th></tr></thead><tbody>
      {rows.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.provider === 'google' ? 'Google' : u.provider === 'facebook' ? 'Facebook' : 'Mật khẩu'}</td>
        <td><select value={u.role} disabled={u.id === meId} onChange={(e) => patch(u.id, { role: e.target.value })}>{Object.entries(ROLE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
        <td>{u.id === meId ? 'Bạn' : <button className="ghost" onClick={() => patch(u.id, { active: !u.active })}>{u.active ? 'Đang hoạt động · Khóa' : 'Đã khóa · Mở'}</button>}</td></tr>)}</tbody></table></div></>);
}
export default function Account() {
  const { user, ready } = useAppSelector((s) => s.auth);
  if (!ready) return <section className="wrap"><p>Đang tải…</p></section>;
  if (!user) return <Navigate to="/dang-nhap" replace />;
  const staff = user.role !== 'khach_hang';
  return (<><section className="pagehead"><h1>Xin chào, {user.name}</h1><p>{ROLE[user.role]} · {user.email}</p></section>
    <section className="wrap"><h2>{staff ? 'Yêu cầu tư vấn của khách hàng' : 'Yêu cầu tư vấn của bạn'}</h2>
      <Leads url={staff ? '/api/leads' : '/api/my/leads'} editable={staff} />
      {user.role === 'admin' && <p><Link className="ghost" to="/quan-tri">Vào trang quản trị (sản phẩm, tin tức, dự án, trang, tài khoản) →</Link></p>}</section></>);
}

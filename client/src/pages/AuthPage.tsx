import { useEffect, useState, FormEvent } from 'react'; import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { login, register } from '../store/authSlice'; import { api } from '../utils/api';
const LOI: Record<string, string> = { huy: 'Bạn đã hủy đăng nhập.', loi: 'Không đăng nhập được, vui lòng thử lại.', khoa: 'Tài khoản đã bị khóa.',
  nhanvien: 'Email này thuộc tài khoản nhân viên. Hãy đăng nhập ở trang nhân viên bằng mật khẩu riêng.', 'trung-email': 'Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng email và mật khẩu.' };
// mode: login = khách hàng, register = khách hàng đăng ký, staff = nhân viên và quản trị (tài khoản do admin cấp, mật khẩu riêng)
export default function AuthPage({ mode }: { mode: 'login' | 'register' | 'staff' }) {
  const reg = mode === 'register', staff = mode === 'staff'; const d = useAppDispatch(); const go = useNavigate(); const user = useAppSelector((s) => s.auth.user); const [sp] = useSearchParams();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' }); const [err, setErr] = useState(LOI[sp.get('loi') || ''] || ''); const [busy, setBusy] = useState(false);
  const [prov, setProv] = useState({ google: false, facebook: false });
  useEffect(() => { if (!staff) api<{ google: boolean; facebook: boolean }>('/api/auth/providers').then(setProv).catch(() => {}); }, [staff]);
  const on = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  if (user) return <Navigate to="/tai-khoan" replace />;
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr(''); setBusy(true);
    try { await d(reg ? register(f) : login({ email: f.email, password: f.password, scope: staff ? 'staff' : 'customer' })).unwrap(); go('/tai-khoan'); } catch (x: any) { setErr(x.message); } finally { setBusy(false); } };
  return (<section className="authbox"><h1>{staff ? 'Đăng nhập nhân viên / quản trị' : reg ? 'Đăng ký tài khoản khách hàng' : 'Đăng nhập khách hàng'}</h1>
    {!staff && (prov.google || prov.facebook) && <div className="social">{prov.google && <a className="sbtn" href="/api/auth/google">Tiếp tục với Google</a>}{prov.facebook && <a className="sbtn" href="/api/auth/facebook">Tiếp tục với Facebook</a>}<small>hoặc dùng email và mật khẩu</small></div>}
    <form onSubmit={submit}>
      {reg && <label>Họ tên<input value={f.name} onChange={on('name')} autoComplete="name" required /></label>}
      <label>Email<input type="email" value={f.email} onChange={on('email')} autoComplete="email" required /></label>
      {reg && <label>Số điện thoại (không bắt buộc)<input value={f.phone} onChange={on('phone')} inputMode="tel" autoComplete="tel" /></label>}
      <label>Mật khẩu{reg && ' (từ 8 ký tự)'}<input type="password" value={f.password} onChange={on('password')} autoComplete={reg ? 'new-password' : 'current-password'} minLength={reg ? 8 : undefined} required /></label>
      {err && <p className="err" role="alert">{err}</p>}<button disabled={busy}>{busy ? 'Đang xử lý…' : reg ? 'Đăng ký' : 'Đăng nhập'}</button></form>
    {!staff && <p>{reg ? <>Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></> : <>Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link></>}</p>}
    <small>{staff ? 'Tài khoản nhân viên và quản trị do quản trị viên cấp, không đăng ký công khai.' : 'Tài khoản đăng ký ở đây luôn là khách hàng và do quản trị viên quản lý.'}</small></section>);
}

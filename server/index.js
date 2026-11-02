import express from 'express'; import cors from 'cors';
import seed from './seed.json' with { type: 'json' };
import { calcSolar, homePackages, calcBusiness } from './calc.js';
import fs from 'node:fs'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
import { listProducts, addProduct, updateProduct, deleteProduct, addNews, updateNews, deleteNews, addProject, updateProject, deleteProject, getPage, setPage, findUserByProvider, linkProvider } from './db.js';
import { listProjects, listNews, getNews, addLead, listLeads, listLeadsByUser, setLeadStatus, createUser, findUserByEmail, listUsers, updateUser, hasAdmin, getUser } from './db.js';
import { ROLES, COOKIE, cookies, newState, checkState, hashPassword, checkPassword, signToken, session, requireRole, tooMany, failed } from './auth.js';
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || false, credentials: true }), express.json({ limit: '50kb' }), session);
// chống CSRF: yêu cầu thay đổi dữ liệu bắt buộc là JSON (trình duyệt không gửi chéo trang được nếu không qua CORS)
app.use((req, res, next) => (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.is('json') || req.is('image/*')) ? next() : res.status(415).json({ error: 'Cần gửi JSON' }));
const clean = (v, n) => String(v ?? '').trim().slice(0, n);
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const setCookie = (res, uid) => res.cookie(COOKIE, signToken(uid), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 864e5 });
// tài khoản admin đầu tiên: đặt ADMIN_EMAIL và ADMIN_PASSWORD khi chạy server lần đầu
if (!hasAdmin()) {
  const { ADMIN_EMAIL: e, ADMIN_PASSWORD: p } = process.env;
  if (e && p && isEmail(e) && p.length >= 8) { createUser({ name: 'Quản trị viên', email: e.toLowerCase(), hash: hashPassword(p), role: 'admin' }); console.log('Đã tạo tài khoản admin', e); }
  else console.warn('Chưa có admin. Chạy lại với ADMIN_EMAIL và ADMIN_PASSWORD (từ 8 ký tự).');
}
function newUser(body, role) {
  const name = clean(body.name, 100), email = clean(body.email, 120).toLowerCase(), phone = clean(body.phone, 20).replace(/\s/g, ''), password = String(body.password ?? '');
  if (name.length < 2) return { error: 'Họ tên tối thiểu 2 ký tự' };
  if (!isEmail(email)) return { error: 'Email không hợp lệ' };
  if (phone && !/^0\d{9}$/.test(phone)) return { error: 'Số điện thoại cần đủ 10 số, bắt đầu bằng 0' };
  if (password.length < 8 || password.length > 128) return { error: 'Mật khẩu từ 8 đến 128 ký tự' };
  if (findUserByEmail(email)) return { error: 'Email đã được đăng ký' };
  return { id: createUser({ name, email, phone, hash: hashPassword(password), role }) };
}
// ---- Xác thực
app.post('/api/auth/register', (req, res) => { // chỉ tạo tài khoản khách hàng
  const r = newUser(req.body, 'khach_hang'); if (r.error) return res.status(400).json({ error: r.error });
  setCookie(res, r.id); res.status(201).json({ user: getUser(r.id) });
});
app.post('/api/auth/login', (req, res) => {
  const email = clean(req.body.email, 120).toLowerCase(), key = req.ip + '|' + email;
  if (tooMany(key)) return res.status(429).json({ error: 'Đăng nhập sai quá nhiều lần, thử lại sau 15 phút' });
  const u = findUserByEmail(email);
  const staff = req.body.scope === 'staff'; // /nhan-vien: chỉ admin và nhân viên; /dang-nhap: chỉ khách hàng
  if (!u || !u.active || (staff !== (u.role !== 'khach_hang')) || !checkPassword(String(req.body.password ?? ''), u.password_hash)) { failed(key); return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' }); }
  setCookie(res, u.id); res.json({ user: getUser(u.id) });
});
app.post('/api/auth/logout', (req, res) => { res.clearCookie(COOKIE); res.json({ ok: true }); });
app.get('/api/auth/me', (req, res) => res.json({ user: req.user }));
// ---- Nội dung công khai
app.get('/api/products', (req, res) => res.json(listProducts()));
app.get('/api/pages/:slug', (req, res) => { const p = getPage(req.params.slug); p ? res.json(p) : res.status(404).json({ error: 'Không tìm thấy trang' }); });
app.get('/api/projects', (req, res) => res.json(listProjects(req.query.type)));
app.get('/api/news', (req, res) => res.json(listNews()));
app.get('/api/news/:slug', (req, res) => { const n = getNews(req.params.slug); n ? res.json(n) : res.status(404).json({ error: 'Không tìm thấy bài viết' }); });
app.post('/api/calc', (req, res) => {
  const bill = Number(req.body.bill);
  if (!(bill > 0)) return res.status(400).json({ error: 'Nhập số tiền điện hợp lệ' });
  res.json(calcSolar({ ...req.body, bill }));
});
app.get('/api/packages', (req, res) => res.json(homePackages()));
app.post('/api/calc-business', (req, res) => {
  const area = Number(req.body.area);
  if (!(area >= 20 && area <= 200000)) return res.status(400).json({ error: 'Diện tích mái từ 20 đến 200.000 m²' });
  res.json(calcBusiness({ area, place: String(req.body.place || 'Quảng Ninh') }));
});
// ---- Yêu cầu tư vấn
app.post('/api/leads', (req, res) => {
  const name = clean(req.body.name, 100), phone = clean(req.body.phone, 20).replace(/\s/g, ''), message = clean(req.body.message, 1000);
  if (!name || !/^0\d{9}$/.test(phone)) return res.status(400).json({ error: 'Tên hoặc số điện thoại không hợp lệ' });
  res.status(201).json({ ok: true, id: addLead({ name, phone, message, userId: req.user?.id ?? null }) });
});
app.get('/api/my/leads', requireRole('khach_hang', 'nhan_vien', 'admin'), (req, res) => res.json(listLeadsByUser(req.user.id)));
app.get('/api/leads', requireRole('nhan_vien', 'admin'), (req, res) => res.json(listLeads()));
const STATUS = ['moi', 'da_goi', 'da_bao_gia', 'hoan_thanh', 'huy'];
app.patch('/api/leads/:id', requireRole('nhan_vien', 'admin'), (req, res) => {
  if (!STATUS.includes(req.body.status)) return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  setLeadStatus(Number(req.params.id), req.body.status) ? res.json({ ok: true }) : res.status(404).json({ error: 'Không tìm thấy' });
});
// ---- Quản trị tài khoản (chỉ admin)
app.get('/api/admin/users', requireRole('admin'), (req, res) => res.json(listUsers()));
app.post('/api/admin/users', requireRole('admin'), (req, res) => {
  const role = req.body.role; if (!ROLES.includes(role)) return res.status(400).json({ error: 'Vai trò không hợp lệ' });
  const r = newUser(req.body, role); r.error ? res.status(400).json({ error: r.error }) : res.status(201).json({ user: getUser(r.id) });
});
app.patch('/api/admin/users/:id', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id), { role, active } = req.body;
  if (id === req.user.id) return res.status(400).json({ error: 'Không thể đổi quyền hoặc khóa chính bạn' });
  if (role !== undefined && !ROLES.includes(role)) return res.status(400).json({ error: 'Vai trò không hợp lệ' });
  if (!getUser(id)) return res.status(404).json({ error: 'Không tìm thấy' });
  updateUser(id, { role, active: active === undefined ? undefined : !!active }); res.json({ user: getUser(id) });
});

// ---- Đăng nhập bằng Google / Facebook (chỉ tạo tài khoản KHÁCH HÀNG; nhân viên và admin phải dùng mật khẩu riêng)
const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:5173').replace(/\/$/, '');
const FB = process.env.FACEBOOK_API_VERSION ? '/' + process.env.FACEBOOK_API_VERSION : '';
const PROV = {
  google: { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET, auth: 'https://accounts.google.com/o/oauth2/v2/auth', token: 'https://oauth2.googleapis.com/token', scope: 'openid email profile' },
  facebook: { id: process.env.FACEBOOK_APP_ID, secret: process.env.FACEBOOK_APP_SECRET, auth: `https://www.facebook.com${FB}/dialog/oauth`, token: `https://graph.facebook.com${FB}/oauth/access_token`, scope: 'public_profile,email' },
};
const on = (k) => !!(PROV[k]?.id && PROV[k]?.secret);
app.get('/api/auth/providers', (req, res) => res.json({ google: on('google'), facebook: on('facebook') }));
app.get('/api/auth/:p/callback', async (req, res) => {
  const k = req.params.p, fail = (c) => res.redirect(`${PUBLIC_URL}/dang-nhap?loi=${c}`);
  if (!PROV[k] || !on(k)) return res.status(404).end();
  res.clearCookie('oauth_state');
  if (req.query.error || !checkState(cookies(req).oauth_state, String(req.query.state || '')) || !req.query.code) return fail('huy');
  try {
    const P = PROV[k], redirect = `${PUBLIC_URL}/api/auth/${k}/callback`; let info;
    if (k === 'google') {
      const t = await (await fetch(P.token, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code: String(req.query.code), client_id: P.id, client_secret: P.secret, redirect_uri: redirect, grant_type: 'authorization_code' }) })).json();
      if (!t.access_token) return fail('loi');
      const u = await (await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: 'Bearer ' + t.access_token } })).json();
      info = { pid: String(u.sub || ''), name: u.name || u.email, email: String(u.email || '').toLowerCase(), verified: u.email_verified === true };
    } else {
      const t = await (await fetch(`${P.token}?${new URLSearchParams({ client_id: P.id, client_secret: P.secret, redirect_uri: redirect, code: String(req.query.code) })}`)).json();
      if (!t.access_token) return fail('loi');
      const u = await (await fetch(`https://graph.facebook.com${FB}/me?${new URLSearchParams({ fields: 'id,name,email', access_token: t.access_token })}`)).json();
      info = { pid: String(u.id || ''), name: u.name, email: String(u.email || '').toLowerCase(), verified: false };
    }
    if (!info.pid) return fail('loi');
    let user = findUserByProvider(k, info.pid);
    if (!user) {
      const same = info.email && findUserByEmail(info.email);
      if (same) { // email đã có tài khoản
        if (same.role !== 'khach_hang') return fail('nhanvien');           // nhân viên/admin không đăng nhập bằng mạng xã hội
        if (!(k === 'google' && info.verified && !same.provider)) return fail('trung-email'); // chỉ liên kết khi Google xác nhận email
        linkProvider(same.id, k, info.pid); user = same;
      } else user = getUser(createUser({ name: String(info.name || 'Khách hàng').slice(0, 100), email: info.email || `${k}-${info.pid}@khach.halosun.invalid`, hash: '!social', role: 'khach_hang', provider: k, providerId: info.pid }));
    }
    if (!user.active) return fail('khoa');
    setCookie(res, user.id); res.redirect(`${PUBLIC_URL}/tai-khoan`);
  } catch { fail('loi'); }
});
app.get('/api/auth/:p', (req, res) => {
  const k = req.params.p; if (!PROV[k] || !on(k)) return res.status(404).json({ error: 'Chưa cấu hình đăng nhập ' + k });
  const st = newState(); res.cookie('oauth_state', st.cookie, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 6e5 });
  const P = PROV[k]; res.redirect(`${P.auth}?${new URLSearchParams({ client_id: P.id, redirect_uri: `${PUBLIC_URL}/api/auth/${k}/callback`, response_type: 'code', scope: P.scope, state: st.v })}`);
});
// ---- Quản trị nội dung (chỉ admin): ảnh, sản phẩm, tin tức, dự án, trang
const UP = fileURLToPath(new URL('./uploads/', import.meta.url)); fs.mkdirSync(UP, { recursive: true });
app.use('/uploads', express.static(UP, { maxAge: '7d', index: false, setHeaders: (r) => r.set('X-Content-Type-Options', 'nosniff') }));
const kind = (b) => b.length < 12 ? null : (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) ? 'jpg' : b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) ? 'png'
  : (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') ? 'webp' : b.subarray(0, 3).toString() === 'GIF' ? 'gif' : null; // không nhận SVG (có thể chứa mã độc)
app.post('/api/admin/upload', requireRole('admin'), express.raw({ type: 'image/*', limit: '5mb' }), (req, res) => {
  const ext = Buffer.isBuffer(req.body) && kind(req.body); if (!ext) return res.status(400).json({ error: 'Chỉ nhận ảnh JPG, PNG, WebP hoặc GIF (tối đa 5 MB)' });
  const name = crypto.randomBytes(12).toString('hex') + '.' + ext; fs.writeFileSync(UP + name, req.body); res.status(201).json({ url: '/uploads/' + name });
});
const admin = requireRole('admin'), bad = (res, m) => res.status(400).json({ error: m });
const okImg = (v) => v === '' || /^\/(uploads|projects)\/[\w.-]+$/.test(v) || /^https:\/\/\S+$/.test(v);
const okDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));
const cats = Object.fromEntries(seed.cats.map((c) => [c.key, (c.subs || []).map((s) => s.key)]));
const paras = (v) => (Array.isArray(v) ? v : String(v ?? '').split(/\n\s*\n/)).map((x) => clean(x, 3000)).filter(Boolean).slice(0, 30);
function readProduct(b) { const p = { category: clean(b.category, 30), sub: clean(b.sub, 30), name: clean(b.name, 150), image: clean(b.image, 300), description: clean(b.description, 2000) };
  if (!cats[p.category]) return { error: 'Nhóm sản phẩm không hợp lệ' }; if (p.sub && !cats[p.category].includes(p.sub)) return { error: 'Nhóm con không hợp lệ' };
  if (p.name.length < 2) return { error: 'Nhập tên sản phẩm' }; if (!okImg(p.image)) return { error: 'Ảnh không hợp lệ' }; return { v: p }; }
function readNews(b) { const n = { title: clean(b.title, 200), summary: clean(b.summary, 500), body: paras(b.body), date: clean(b.date, 10), source: clean(b.source, 100), url: clean(b.url, 400) };
  if (n.title.length < 3) return { error: 'Nhập tiêu đề' }; if (!n.body.length) return { error: 'Nhập nội dung bài viết' }; if (!okDate(n.date)) return { error: 'Ngày không hợp lệ (YYYY-MM-DD)' };
  if (n.url && !/^https?:\/\/\S+$/.test(n.url)) return { error: 'Link nguồn phải bắt đầu bằng http hoặc https' }; return { v: n }; }
function readProject(b) { const p = { name: clean(b.name, 150), type: clean(b.type, 60), location: clean(b.location, 100), summary: clean(b.summary, 1000), image: clean(b.image, 300), date: clean(b.date, 10) };
  if (p.name.length < 2 || !p.type) return { error: 'Nhập tên và nhóm dự án' }; if (!okImg(p.image)) return { error: 'Ảnh không hợp lệ' }; if (!okDate(p.date)) return { error: 'Ngày không hợp lệ (YYYY-MM-DD)' }; return { v: p }; }
const crud = (path, read, add, upd, del, key = 'id') => {
  app.post(`/api/admin/${path}`, admin, (req, res) => { const r = read(req.body); r.error ? bad(res, r.error) : res.status(201).json({ ok: true, [key]: add(r.v) }); });
  app.patch(`/api/admin/${path}/:k`, admin, (req, res) => { const r = read(req.body); if (r.error) return bad(res, r.error); upd(key === 'id' ? Number(req.params.k) : req.params.k, r.v) ? res.json({ ok: true }) : res.status(404).json({ error: 'Không tìm thấy' }); });
  app.delete(`/api/admin/${path}/:k`, admin, (req, res) => del(key === 'id' ? Number(req.params.k) : req.params.k) ? res.json({ ok: true }) : res.status(404).json({ error: 'Không tìm thấy' }));
};
crud('products', readProduct, addProduct, updateProduct, deleteProduct); crud('news', readNews, addNews, updateNews, deleteNews, 'slug'); crud('projects', readProject, addProject, updateProject, deleteProject);
app.put('/api/admin/pages/:slug', admin, (req, res) => {
  if (!seed.pages[req.params.slug]) return res.status(404).json({ error: 'Không có trang này' });
  const title = clean(req.body.title, 150), body = paras(req.body.body); if (!title || !body.length) return bad(res, 'Nhập tiêu đề và nội dung');
  setPage(req.params.slug, title, body); res.json({ ok: true });
});
app.listen(4000, () => console.log('API http://localhost:4000'));

// Xác thực: mật khẩu băm scrypt, phiên bằng token ký HMAC lưu trong cookie httpOnly. Không cần thư viện ngoài.
import crypto from 'node:crypto'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
import { getUser } from './db.js';
export const ROLES = ['admin', 'nhan_vien', 'khach_hang'];
const dir = fileURLToPath(new URL('./data/', import.meta.url)), keyFile = dir + 'secret.key';
const SECRET = process.env.AUTH_SECRET || (fs.existsSync(keyFile) ? fs.readFileSync(keyFile, 'utf8')
  : (() => { const k = crypto.randomBytes(32).toString('hex'); fs.writeFileSync(keyFile, k, { mode: 0o600 }); return k; })());
export const hashPassword = (pw) => { const salt = crypto.randomBytes(16); return salt.toString('hex') + ':' + crypto.scryptSync(pw, salt, 64).toString('hex'); };
export const checkPassword = (pw, stored) => { const [s, h] = String(stored).split(':'); if (!s || !h) return false;
  const want = Buffer.from(h, 'hex'), got = crypto.scryptSync(pw, Buffer.from(s, 'hex'), 64); return got.length === want.length && crypto.timingSafeEqual(got, want); };
const sig = (body) => crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
export const signToken = (uid) => { const body = Buffer.from(JSON.stringify({ uid, exp: Date.now() + 7 * 864e5 })).toString('base64url'); return body + '.' + sig(body); };
export const verifyToken = (t) => { const [body, s] = String(t || '').split('.'); if (!body || !s) return null;
  const a = Buffer.from(s), b = Buffer.from(sig(body)); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url')); return p.exp > Date.now() ? p : null; } catch { return null; } };
export const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(';').map((c) => c.trim().split('=')).filter((x) => x[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));
export const COOKIE = 'halosun_token';
export const session = (req, res, next) => { const p = verifyToken(cookies(req)[COOKIE]); const u = p && getUser(p.uid); req.user = u && u.active ? u : null; next(); };
export const requireRole = (...roles) => (req, res, next) => !req.user ? res.status(401).json({ error: 'Vui lòng đăng nhập' })
  : roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Không đủ quyền' });
const tries = new Map(); // giới hạn đăng nhập sai: 8 lần / 15 phút
export const tooMany = (key) => { const now = Date.now(), t = (tries.get(key) || []).filter((x) => now - x < 9e5); tries.set(key, t); return t.length >= 8; };
export const failed = (key) => tries.set(key, [...(tries.get(key) || []), Date.now()]);
// state chống CSRF cho đăng nhập Google/Facebook: giá trị ngẫu nhiên ký HMAC, sống 10 phút, lưu trong cookie httpOnly
export const newState = () => { const v = crypto.randomBytes(16).toString('hex'); const body = Buffer.from(JSON.stringify({ v, exp: Date.now() + 6e5 })).toString('base64url'); return { v, cookie: body + '.' + sig(body) }; };
export const checkState = (cookie, v) => { const [body, s] = String(cookie || '').split('.'); if (!body || !s || !v) return false;
  const a = Buffer.from(s), b = Buffer.from(sig(body)); if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try { const p = JSON.parse(Buffer.from(body, 'base64url')); const x = Buffer.from(String(p.v)), y = Buffer.from(String(v)); return p.exp > Date.now() && x.length === y.length && crypto.timingSafeEqual(x, y); } catch { return false; } };

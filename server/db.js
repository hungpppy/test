// SQLite tích hợp sẵn trong Node >= 22.13 (node:sqlite) – không cần cài thêm thư viện.
// Muốn dùng better-sqlite3: đổi dòng import, API prepare/run/get/all giống nhau.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
import seed from './seed.json' with { type: 'json' };
const dir = fileURLToPath(new URL('./data/', import.meta.url)); fs.mkdirSync(dir, { recursive: true });
export const db = new DatabaseSync(dir + 'halosun.db');
db.exec(`
CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL, message TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('admin','nhan_vien','khach_hang')), active INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, type TEXT NOT NULL, location TEXT, capacity TEXT, summary TEXT);
CREATE TABLE IF NOT EXISTS news (slug TEXT PRIMARY KEY, title TEXT NOT NULL, summary TEXT, body TEXT NOT NULL, published_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, sub TEXT DEFAULT '', name TEXT NOT NULL, image TEXT DEFAULT '', description TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS pages (slug TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
// bổ sung cột cho cơ sở dữ liệu cũ
const addCol = (t, c, def) => { if (!db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c)) db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} ${def}`); };
addCol('leads', 'user_id', 'INTEGER'); addCol('leads', 'status', "TEXT NOT NULL DEFAULT 'moi'");
addCol('users', 'provider', 'TEXT'); addCol('users', 'provider_id', 'TEXT'); db.exec('CREATE UNIQUE INDEX IF NOT EXISTS users_provider ON users (provider, provider_id)');
addCol('projects', 'image', 'TEXT'); addCol('projects', 'date', 'TEXT'); addCol('news', 'source', 'TEXT'); addCol('news', 'url', 'TEXT');
const count = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
const tx = (fn) => { db.exec('BEGIN'); try { fn(); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; } };
// nạp lại dự án và tin tức mẫu khi seed.json đổi "version" (dữ liệu khách hàng và tài khoản không bị đụng tới)
const ver = db.prepare("SELECT value FROM meta WHERE key = 'content_version'").get()?.value;
const edited = db.prepare("SELECT value FROM meta WHERE key = 'content_edited'").get()?.value === '1';
if (ver !== String(seed.version) && !edited) tx(() => {
  db.exec('DELETE FROM projects; DELETE FROM news;');
  const p = db.prepare('INSERT INTO projects (name,type,location,capacity,summary,image,date) VALUES (?,?,?,?,?,?,?)');
  seed.projects.forEach((x) => p.run(x.name, x.type, x.location, x.capacity ?? '', x.summary, x.image ?? '', x.date ?? ''));
  const n = db.prepare('INSERT INTO news (slug,title,summary,body,published_at,source,url) VALUES (?,?,?,?,?,?,?)');
  seed.news.forEach((x) => n.run(x.slug, x.title, x.summary, JSON.stringify(x.body), x.date, x.source ?? '', x.url ?? ''));
  db.exec('DELETE FROM products');
  const pr = db.prepare('INSERT INTO products (category,sub,name,image,description) VALUES (?,?,?,?,?)');
  seed.products.forEach((x) => pr.run(x.category, x.sub ?? '', x.name, x.image ?? '', x.description ?? ''));
  db.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('content_version', ?)").run(String(seed.version));
});
// bản cũ chưa có bảng sản phẩm / trang: nạp mẫu một lần, không bao giờ ghi đè nội dung admin đã sửa
if (!count('products')) tx(() => { const pr = db.prepare('INSERT INTO products (category,sub,name,image,description) VALUES (?,?,?,?,?)'); seed.products.forEach((x) => pr.run(x.category, x.sub ?? '', x.name, x.image ?? '', x.description ?? '')); });
for (const [slug, pg] of Object.entries(seed.pages)) db.prepare('INSERT OR IGNORE INTO pages (slug,title,body) VALUES (?,?,?)').run(slug, pg.title, JSON.stringify(pg.body));
// chuyển yêu cầu cũ từ leads.json (nếu có) sang SQLite, một lần
const old = dir + 'leads.json';
if (fs.existsSync(old) && !count('leads')) { try { const s = db.prepare('INSERT INTO leads (name,phone,message,created_at) VALUES (?,?,?,?)');
  tx(() => JSON.parse(fs.readFileSync(old, 'utf8')).forEach((l) => s.run(l.name, l.phone, l.message ?? '', l.at ?? new Date().toISOString()))); fs.renameSync(old, old + '.migrated'); } catch {} }
export const listProjects = (type) => type ? db.prepare('SELECT * FROM projects WHERE type = ? ORDER BY id').all(type) : db.prepare('SELECT * FROM projects ORDER BY id').all();
export const listNews = () => db.prepare('SELECT slug,title,summary,published_at,source,url FROM news ORDER BY published_at DESC').all();
export const getNews = (slug) => { const n = db.prepare('SELECT * FROM news WHERE slug = ?').get(slug); return n && { ...n, body: JSON.parse(n.body) }; };
export const addLead = ({ name, phone, message, userId = null }) => Number(db.prepare('INSERT INTO leads (name,phone,message,user_id) VALUES (?,?,?,?)').run(name, phone, message, userId).lastInsertRowid);
export const listLeadsByUser = (uid) => db.prepare('SELECT * FROM leads WHERE user_id = ? ORDER BY id DESC').all(uid);
export const setLeadStatus = (id, status) => db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id).changes;
const U = 'id,name,email,phone,role,active,created_at,provider';
export const createUser = ({ name, email, phone = '', hash, role, provider = null, providerId = null }) => Number(db.prepare('INSERT INTO users (name,email,phone,password_hash,role,provider,provider_id) VALUES (?,?,?,?,?,?,?)').run(name, email, phone, hash, role, provider, providerId).lastInsertRowid);
export const findUserByProvider = (provider, pid) => db.prepare('SELECT * FROM users WHERE provider = ? AND provider_id = ?').get(provider, pid);
export const linkProvider = (id, provider, pid) => db.prepare('UPDATE users SET provider = ?, provider_id = ? WHERE id = ?').run(provider, pid, id);
export const getUser = (id) => db.prepare(`SELECT ${U} FROM users WHERE id = ?`).get(id);
export const findUserByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email);
export const listUsers = () => db.prepare(`SELECT ${U} FROM users ORDER BY id`).all();
export const updateUser = (id, { role, active }) => { if (role) db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id); if (active !== undefined) db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active ? 1 : 0, id); };
export const hasAdmin = () => !!db.prepare("SELECT 1 FROM users WHERE role = 'admin' AND active = 1").get();
export const listLeads = () => db.prepare('SELECT * FROM leads ORDER BY id DESC').all();

// ---- Nội dung do admin quản lý (mọi thao tác ghi đều đánh dấu "đã sửa" để dữ liệu mẫu không ghi đè)
const touch = () => db.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('content_edited','1')").run();
const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'bai-viet';
export const listProducts = () => db.prepare('SELECT * FROM products ORDER BY id').all();
export const addProduct = (p) => { touch(); return Number(db.prepare('INSERT INTO products (category,sub,name,image,description) VALUES (?,?,?,?,?)').run(p.category, p.sub, p.name, p.image, p.description).lastInsertRowid); };
export const updateProduct = (id, p) => { touch(); return db.prepare('UPDATE products SET category=?, sub=?, name=?, image=?, description=? WHERE id=?').run(p.category, p.sub, p.name, p.image, p.description, id).changes; };
export const deleteProduct = (id) => { touch(); return db.prepare('DELETE FROM products WHERE id = ?').run(id).changes; };
export const addNews = (n) => { touch(); const slug = slugify(n.title) + '-' + Date.now().toString(36);
  db.prepare('INSERT INTO news (slug,title,summary,body,published_at,source,url) VALUES (?,?,?,?,?,?,?)').run(slug, n.title, n.summary, JSON.stringify(n.body), n.date, n.source, n.url); return slug; };
export const updateNews = (slug, n) => { touch(); return db.prepare('UPDATE news SET title=?, summary=?, body=?, published_at=?, source=?, url=? WHERE slug=?').run(n.title, n.summary, JSON.stringify(n.body), n.date, n.source, n.url, slug).changes; };
export const deleteNews = (slug) => { touch(); return db.prepare('DELETE FROM news WHERE slug = ?').run(slug).changes; };
export const addProject = (p) => { touch(); return Number(db.prepare('INSERT INTO projects (name,type,location,capacity,summary,image,date) VALUES (?,?,?,?,?,?,?)').run(p.name, p.type, p.location, '', p.summary, p.image, p.date).lastInsertRowid); };
export const updateProject = (id, p) => { touch(); return db.prepare('UPDATE projects SET name=?, type=?, location=?, summary=?, image=?, date=? WHERE id=?').run(p.name, p.type, p.location, p.summary, p.image, p.date, id).changes; };
export const deleteProject = (id) => { touch(); return db.prepare('DELETE FROM projects WHERE id = ?').run(id).changes; };
export const getPage = (slug) => { const p = db.prepare('SELECT slug,title,body,updated_at FROM pages WHERE slug = ?').get(slug); return p && { ...p, body: JSON.parse(p.body) }; };
export const setPage = (slug, title, body) => { touch(); return db.prepare("UPDATE pages SET title=?, body=?, updated_at=CURRENT_TIMESTAMP WHERE slug=?").run(title, JSON.stringify(body), slug).changes; };

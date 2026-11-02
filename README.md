# HALOSUN – React + Node boilerplate
Chạy: `npm run install:all` → `npm run dev:server` + `npm run dev:client`
| Chủ đề | Vị trí |
|---|---|
| HTML / CSS / SCSS | client/index.html · styles/base.css · styles/main.scss |
| JavaScript / Node.js | server/index.js · utils/format.js |
| JSX / JS | components/Banner.jsx · utils/format.js |
| Function component, Props, State, Hooks | Calculator.tsx · Header.tsx · Banner.jsx |
| Class component, Life cycle | components/Stats.tsx |
| React Router | App.tsx · Header.tsx |
| Redux (thuần) | store/visits.js |
| Redux Toolkit + Thunk | store/calcSlice.ts |
| Redux Saga | store/leadSlice.ts · store/sagas.ts |
| TypeScript / Boilerplate | *.tsx, tsconfig.json, vite.config.ts |

## Yêu cầu tư vấn (backend)
- Form ở trang Liên hệ và cửa sổ kết quả tính toán gửi `POST /api/leads` qua Redux Saga, lưu vào `server/data/leads.json`.
- Xem danh sách: `ADMIN_TOKEN=matkhau npm run dev:server`, rồi `curl -H "x-admin-token: matkhau" http://localhost:4000/api/leads`.

## Cơ sở dữ liệu và các trang
- SQLite (`node:sqlite`, cần Node >= 22.13) lưu yêu cầu tư vấn, dự án và tin tức tại `server/data/halosun.db`. Lần chạy đầu nạp dữ liệu mẫu từ `server/seed.json` (nội dung mẫu, thay bằng nội dung thật). File `leads.json` cũ (nếu có) tự chuyển sang SQLite.
- API: `GET /api/projects?type=`, `GET /api/news`, `GET /api/news/:slug`, `POST /api/leads`, `GET /api/leads` (cần `x-admin-token`).
- Trang: `/` · `/gioi-thieu` · `/du-an` · `/tin-tuc` · `/tin-tuc/:slug` · `/san-pham` · `/lien-he`.
- Dùng MongoDB: thay các hàm trong `server/db.js`, các route trong `index.js` giữ nguyên.

## Tài khoản và phân quyền
- 3 vai trò: **admin**, **nhan_vien** (nhân viên), **khach_hang** (khách hàng). Đăng ký công khai chỉ tạo khách hàng; nhân viên và admin do admin tạo ở trang `/tai-khoan`.
- Tạo admin đầu tiên: `ADMIN_EMAIL=ban@halosun.vn ADMIN_PASSWORD=matkhau-dai npm run dev:server` (chạy một lần, mật khẩu từ 8 ký tự).
- Mật khẩu băm scrypt; phiên là token ký HMAC trong cookie httpOnly 7 ngày; đăng nhập sai quá 8 lần trong 15 phút bị khóa tạm; khi triển khai thật đặt `AUTH_SECRET`, `NODE_ENV=production` và chạy qua HTTPS.
- Quyền: khách hàng xem yêu cầu của mình; nhân viên xem và đổi trạng thái mọi yêu cầu; admin thêm quản lý tài khoản (đổi vai trò, khóa/mở).
- Giao diện sáng/tối/tự động (sáng 6h–18h) ở nút trên thanh menu, lưu theo trình duyệt.

## Đăng nhập Google / Facebook và quản trị nội dung
- **Hai lối đăng nhập riêng:** khách hàng ở `/dang-nhap` (có đăng ký, Google, Facebook); nhân viên và admin ở `/nhan-vien` (chỉ mật khẩu riêng, không đăng ký công khai, không dùng mạng xã hội). Một tài khoản đăng nhập sai lối sẽ nhận thông báo chung "Email hoặc mật khẩu không đúng".
- **Khách đăng nhập bằng Google/Facebook** luôn là khách hàng, hiện trong `Quản trị → Tài khoản` (cột "Nguồn") để admin quản lý, khóa hoặc đổi vai trò.
- **Cấu hình (biến môi trường của server):** `PUBLIC_URL` (địa chỉ website, khi chạy thử là `http://localhost:5173`), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`. Chưa đặt thì nút tương ứng tự ẩn.
  - Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web) → Authorized redirect URI: `{PUBLIC_URL}/api/auth/google/callback`.
  - Facebook for Developers → Facebook Login → Valid OAuth Redirect URIs: `{PUBLIC_URL}/api/auth/facebook/callback`, bật quyền `email`.
- **Trang quản trị `/quan-tri` (chỉ admin):** thêm, sửa, xóa sản phẩm, tin tức, dự án; tải ảnh lên (JPG, PNG, WebP, GIF tối đa 5 MB, lưu ở `server/uploads/`); sửa nội dung trang Giới thiệu; quản lý tài khoản và yêu cầu tư vấn. Dữ liệu mẫu không bao giờ ghi đè sau khi admin đã sửa.
- **Khái toán điện mặt trời:** trang `/khai-toan` nhúng công cụ tại `https://halosun888.github.io/halosun8888/` (đổi địa chỉ ở `company.ts`).

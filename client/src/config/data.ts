// Nội dung mẫu – số liệu, dự án, đối tác cần thay bằng thông tin thật của HALOSUN
export interface NavItem { to: string; label: string; sub?: NavItem[] }
export const nav: NavItem[] = [
  { to: '/', label: 'Trang chủ' }, { to: '/gioi-thieu', label: 'Giới thiệu' },
  { to: '/giai-phap-dau-tu/doanh-nghiep', label: 'Giải pháp đầu tư', sub: [{ to: '/giai-phap-dau-tu/doanh-nghiep', label: 'Doanh nghiệp' }, { to: '/giai-phap-dau-tu/ho-gia-dinh', label: 'Hộ gia đình' }] },
  { to: '/chi-phi-lap-dat', label: 'Chi phí lắp đặt', sub: [
    { to: '/chi-phi-lap-dat/ap-mai', label: 'Điện mặt trời áp mái' }, { to: '/chi-phi-lap-dat/hoa-luoi', label: 'Điện mặt trời hòa lưới' },
    { to: '/chi-phi-lap-dat/hoa-luoi-luu-tru', label: 'Điện mặt trời hòa lưới có lưu trữ' }, { to: '/chi-phi-lap-dat/doc-lap', label: 'Điện mặt trời độc lập' }] },
  { to: '/san-pham', label: 'Sản phẩm', sub: [
    { to: '/san-pham?loai=panel', label: 'Tấm Pin Mặt Trời' },
    { to: '/san-pham?loai=inverter', label: 'Biến Tần/ Inverter', sub: [{ to: '/san-pham?loai=inverter&nhom=hoa-luoi', label: 'Biến tần hòa lưới' }, { to: '/san-pham?loai=inverter&nhom=hybrid', label: 'Biến tần hybrid' }, { to: '/san-pham?loai=inverter&nhom=doc-lap', label: 'Biến tần độc lập' }] },
    { to: '/san-pham?loai=battery', label: 'Pin lưu trữ' },
    { to: '/san-pham?loai=accessory', label: 'Phụ Kiện Lắp Đặt', sub: [{ to: '/san-pham?loai=accessory&nhom=khung-gia-do', label: 'Khung giá đỡ' }, { to: '/san-pham?loai=accessory&nhom=day-cap', label: 'Dây cáp DC' }, { to: '/san-pham?loai=accessory&nhom=tu-dien', label: 'Tủ điện và thiết bị bảo vệ' }, { to: '/san-pham?loai=accessory&nhom=giam-sat', label: 'Thiết bị giám sát' }] },
    { to: '/san-pham?loai=system', label: 'Hệ thống điện mặt trời' }] },
  { to: '/khai-toan', label: 'Khái toán điện mặt trời' }, { to: '/du-an', label: 'Dự án' }, { to: '/tin-tuc', label: 'Tin tức' }, { to: '/lien-he', label: 'Liên hệ' },
];
export const solutions = [
  { t: 'Hòa lưới có lưu trữ (Hybrid)', d: 'Kết hợp điện mặt trời, điện lưới và pin lưu trữ. Ưu tiên cấp cho tải, phần dư nạp vào pin, dự phòng khi mất điện.' },
  { t: 'Hòa lưới không lưu trữ', d: 'Kết nối trực tiếp với lưới điện quốc gia qua inverter, phần dư có thể phát lên lưới, giảm chi phí tiền điện.' },
  { t: 'Điện mặt trời độc lập', d: 'Hoạt động tách biệt với điện lưới, dùng bộ điều khiển sạc và ắc quy, phù hợp khu vực chưa có điện.' },
];
export const stats = [{ label: 'Dự án tiêu biểu', target: 12 }, { label: 'Giải pháp lắp đặt', target: 4 }, { label: 'Nhóm sản phẩm', target: 5 }];
export const partners = ['Sungrow', 'Luxpower', 'JA Solar', 'Jolywood', 'BSB-ESS', 'Bett Energy'];

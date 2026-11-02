// Sinh từ server/seed.json – danh mục sản phẩm, gói chi phí lắp đặt và nội dung giải pháp đầu tư
export interface Cat { key: string; label: string; subs?: { key: string; label: string }[] }
export interface Price { text: string; source: string; url: string }
export interface Cost { slug: string; title: string; intro: string; suit: string; parts: string[]; factors: string[]; prices: Price[] }
export interface Invest { title: string; lead: string; intro: string[]; benefits: { t: string; d: string }[]; whyUs: string[]; steps: string[] }
export const CATS: Cat[] = [
 {
  "key": "panel",
  "label": "Tấm Pin Mặt Trời"
 },
 {
  "key": "inverter",
  "label": "Biến Tần/ Inverter",
  "subs": [
   {
    "key": "hoa-luoi",
    "label": "Biến tần hòa lưới"
   },
   {
    "key": "hybrid",
    "label": "Biến tần hybrid"
   },
   {
    "key": "doc-lap",
    "label": "Biến tần độc lập"
   }
  ]
 },
 {
  "key": "battery",
  "label": "Pin lưu trữ"
 },
 {
  "key": "accessory",
  "label": "Phụ Kiện Lắp Đặt",
  "subs": [
   {
    "key": "khung-gia-do",
    "label": "Khung giá đỡ"
   },
   {
    "key": "day-cap",
    "label": "Dây cáp DC"
   },
   {
    "key": "tu-dien",
    "label": "Tủ điện và thiết bị bảo vệ"
   },
   {
    "key": "giam-sat",
    "label": "Thiết bị giám sát"
   }
  ]
 },
 {
  "key": "system",
  "label": "Hệ thống điện mặt trời"
 }
];
export const COSTS: Cost[] = [
 {
  "slug": "ap-mai",
  "title": "Điện mặt trời áp mái",
  "intro": "Lắp tấm pin trực tiếp trên mái nhà hoặc mái nhà xưởng, tận dụng diện tích sẵn có để tự sản xuất điện.",
  "suit": "Hộ gia đình và doanh nghiệp có mái bằng phẳng, ít bóng che.",
  "parts": [
   "Tấm pin và khung giá đỡ theo loại mái",
   "Biến tần, tủ điện và thiết bị bảo vệ",
   "Dây cáp, nhân công lắp đặt và nghiệm thu"
  ],
  "factors": [
   "Diện tích và kết cấu mái (tôn, ngói, bê tông)",
   "Công suất lắp đặt (kWp)",
   "Loại tấm pin và biến tần được chọn"
  ],
  "prices": [
   {
    "text": "Giá tấm pin tăng khoảng 40% so với năm ngoái và 5–10% so với đầu năm 2026 (theo một đơn vị lắp đặt tại TP.HCM).",
    "source": "Báo Người Lao Động",
    "url": "https://nld.com.vn/gia-tam-pin-nang-luong-pin-luu-tru-dong-loat-tang-giua-con-sot-lap-dien-mat-troi-mai-nha-196260516095742553.htm"
   },
   {
    "text": "Dự án nhà xưởng tại KCN Hải Yên (Quảng Ninh): khoảng 150 tỷ đồng cho gần 20 MW, tương đương khoảng 7,5 triệu đồng/kWp (HALOSUN tự quy đổi).",
    "source": "Cổng thông tin Chính phủ",
    "url": "https://baochinhphu.vn/bai-3-xanh-hoa-doanh-nghiep-bang-dien-mat-troi-mai-nha-102260728135437976.htm"
   },
   {
    "text": "Một nhà máy ở Đồng Tháp lắp 173,6 kWp (280 tấm pin) trên hơn 1.400 m² mái, tức khoảng 8 m² mái cho mỗi kWp.",
    "source": "VietnamPlus",
    "url": "https://www.vietnamplus.vn/dien-mat-troi-mai-nha-tiep-suc-doanh-nghiep-san-xuat-xanh-tai-dong-thap-post1143741.vnp"
   }
  ]
 },
 {
  "slug": "hoa-luoi",
  "title": "Điện mặt trời hòa lưới",
  "intro": "Hệ thống kết nối trực tiếp với lưới điện qua biến tần, không dùng pin lưu trữ nên chi phí đầu tư thấp nhất.",
  "suit": "Nơi dùng nhiều điện vào ban ngày và có điện lưới ổn định.",
  "parts": [
   "Tấm pin mặt trời",
   "Biến tần hòa lưới",
   "Tủ điện, thiết bị bảo vệ và giám sát"
  ],
  "factors": [
   "Công suất hệ thống",
   "Nhu cầu dùng điện ban ngày",
   "Yêu cầu đấu nối của điện lực địa phương"
  ],
  "prices": [
   {
    "text": "Nếu dùng phần lớn điện vào ban ngày, không cần pin lưu trữ, hệ hòa lưới có chi phí thấp hơn đáng kể so với hệ có pin.",
    "source": "VnExpress",
    "url": "https://vnexpress.net/lap-dien-mat-troi-ho-gia-dinh-bao-lau-hoan-von-5111789.html"
   },
   {
    "text": "Một hộ chi khoảng 90 triệu đồng để lắp điện mặt trời mái nhà và tiết kiệm khoảng 1,6 triệu đồng mỗi tháng.",
    "source": "Báo Dân trí",
    "url": "https://dantri.com.vn/kinh-doanh/chi-90-trieu-dong-lap-dien-mat-troi-mai-nha-tiet-kiem-16-trieu-moi-thang-20261017115340762.htm"
   },
   {
    "text": "Hóa đơn điện từ khoảng 800.000 đồng/tháng là ngưỡng có thể cân nhắc lắp điện mặt trời; hệ khoảng 30 triệu đồng chỉ hợp nhu cầu nhỏ.",
    "source": "Báo Mới",
    "url": "https://baomoi.com/lap-dien-mat-troi-30-trieu-dong-dung-bao-nhieu-dien-moi-dang-dau-tu-c56258826.epi"
   }
  ]
 },
 {
  "slug": "hoa-luoi-luu-tru",
  "title": "Điện mặt trời hòa lưới có lưu trữ",
  "intro": "Kết hợp điện mặt trời, điện lưới và pin lưu trữ (hybrid): ưu tiên cấp cho tải, phần dư nạp vào pin và dự phòng khi mất điện.",
  "suit": "Nơi hay mất điện hoặc dùng nhiều điện vào buổi tối.",
  "parts": [
   "Tấm pin mặt trời",
   "Biến tần hybrid",
   "Pin lưu trữ và tủ điện bảo vệ"
  ],
  "factors": [
   "Dung lượng pin lưu trữ (kWh)",
   "Công suất biến tần hybrid",
   "Số giờ cần dự phòng khi mất điện"
  ],
  "prices": [
   {
    "text": "Tiêu thụ khoảng 600 kWh/tháng: hệ 5 kWp kết hợp pin 10 kWh khoảng 100–120 triệu đồng.",
    "source": "24h",
    "url": "https://www.24h.com.vn/thoi-trang-hi-tech/gia-dinh-dung-bao-nhieu-tien-dien-moi-thang-thi-nen-lap-dien-mat-troi-mai-nha-c407a1768507.html"
   },
   {
    "text": "Hóa đơn 2–3 triệu đồng/tháng: hệ 5–7 kWp kết hợp pin 16 kWh khoảng 150 triệu đồng.",
    "source": "VnExpress",
    "url": "https://vnexpress.net/co-nen-lap-dien-mat-troi-gia-re-5117042.html"
   },
   {
    "text": "Tổng đầu tư cho hộ gia đình khoảng 160–180 triệu đồng, thời gian thu hồi vốn khoảng 3–5 năm.",
    "source": "VnExpress",
    "url": "https://vnexpress.net/lap-dien-mat-troi-ho-gia-dinh-bao-lau-hoan-von-5111789.html"
   },
   {
    "text": "Hệ 6 kWp kèm pin 20 kWh có thể giảm khoảng 1–2 triệu đồng tiền điện mỗi tháng. Lắp nhiều pin chưa chắc tối ưu chi phí, cần cân đối theo nhu cầu thực tế.",
    "source": "Báo Người Lao Động",
    "url": "https://nld.com.vn/gia-tam-pin-nang-luong-pin-luu-tru-dong-loat-tang-giua-con-sot-lap-dien-mat-troi-mai-nha-196260516095742553.htm"
   }
  ]
 },
 {
  "slug": "doc-lap",
  "title": "Điện mặt trời độc lập",
  "intro": "Hệ thống hoạt động tách biệt với điện lưới, dùng bộ điều khiển sạc và ắc quy để cấp điện liên tục.",
  "suit": "Khu vực chưa có điện lưới hoặc cần nguồn điện tự chủ.",
  "parts": [
   "Tấm pin mặt trời",
   "Bộ điều khiển sạc và biến tần độc lập",
   "Ắc quy hoặc pin lưu trữ"
  ],
  "factors": [
   "Tổng công suất và thời gian sử dụng tải",
   "Dung lượng ắc quy",
   "Điều kiện địa hình và vận chuyển"
  ],
  "prices": []
 }
];
export const INVEST: Record<string, Invest> = {
 "doanh-nghiep": {
  "title": "Giải pháp điện mặt trời cho doanh nghiệp",
  "lead": "Giảm chi phí điện cho nhà xưởng, văn phòng và kho bãi",
  "intro": [
   "Điện mặt trời áp mái giúp doanh nghiệp giảm lượng điện mua từ lưới, nhất là vào ban ngày khi nhà xưởng, văn phòng và kho bãi tiêu thụ điện nhiều nhất.",
   "Hệ hòa lưới hoạt động đơn giản: tấm pin hấp thụ ánh sáng mặt trời, biến tần chuyển dòng điện một chiều thành xoay chiều rồi cấp trực tiếp cho thiết bị đang chạy, phần còn thiếu lấy từ lưới điện.",
   "Doanh nghiệp còn có thêm lợi thế về hình ảnh xanh, đáp ứng yêu cầu giảm phát thải ngày càng phổ biến trong chuỗi cung ứng."
  ],
  "benefits": [
   {
    "t": "Giảm chi phí điện hằng năm",
    "d": "Dùng điện tại chỗ vào giờ sản xuất nên lượng điện mua từ lưới giảm, đặc biệt khi nhà máy chạy nhiều ca vào ban ngày."
   },
   {
    "t": "Hướng tới sản xuất xanh",
    "d": "Nhiều chuỗi cung ứng yêu cầu giảm phát thải. Điện mặt trời giúp doanh nghiệp chứng minh cam kết sử dụng năng lượng sạch."
   },
   {
    "t": "Giảm phát thải CO₂",
    "d": "Mỗi kWh điện mặt trời thay cho điện lưới giúp giảm khí thải. Hệ thống 1 MWp tạo ra hàng nghìn kWh mỗi ngày nắng."
   },
   {
    "t": "Hệ thống bền, ít bảo trì",
    "d": "Hệ hòa lưới không dùng ắc quy nên không tốn chi phí thay thế ắc quy. Tấm pin có tuổi thọ nhiều năm."
   },
   {
    "t": "Góp phần làm mát mái nhà xưởng",
    "d": "Tấm pin che một phần bức xạ nắng trực tiếp lên mái, góp phần giảm nhiệt cho khu vực bên dưới."
   }
  ],
  "whyUs": [
   "Thương hiệu năng lượng mặt trời của Công ty TNHH Giải pháp Kỹ thuật Đông Bắc",
   "Nhà thầu bảo trì cơ điện thuộc top 1 tại Quảng Ninh, theo giới thiệu của công ty",
   "Hàng trăm dự án lớn nhỏ tại khu vực Đông, Tây Bắc",
   "Dịch vụ trọn gói: tư vấn, khảo sát, thiết kế, thi công, bảo trì"
  ],
  "steps": [
   "Khảo sát mái, hóa đơn điện và đồ thị phụ tải",
   "Thiết kế, tính công suất và báo giá",
   "Thi công, đấu nối và nghiệm thu",
   "Vận hành, giám sát và bảo trì định kỳ"
  ]
 },
 "ho-gia-dinh": {
  "title": "Giải pháp điện mặt trời cho hộ gia đình",
  "lead": "Tiết kiệm tiền điện mỗi tháng cho ngôi nhà của bạn",
  "intro": [
   "Hệ thống điện mặt trời hòa lưới cho hộ gia đình dùng tấm pin trên mái để tạo điện một chiều, biến tần đổi thành điện xoay chiều cấp cho các thiết bị trong nhà; phần còn thiếu lấy từ lưới điện.",
   "Điện mặt trời thay thế đúng những kWh ở các bậc giá cao nhất trong biểu giá bậc thang, nên hộ dùng nhiều điện ban ngày thường tiết kiệm rõ rệt. Hộ chủ yếu dùng điện buổi tối có thể cân nhắc thêm pin lưu trữ.",
   "Từ 26/6/2026, theo Nghị định 243/2026/NĐ-CP, hộ gia đình được bán lại tối đa 50% sản lượng điện dư lên lưới (trước đây là 20%), theo thỏa thuận với bên mua điện.",
   "Tấm pin có thể lắp trên mái nhà hoặc sân thượng. Nên khảo sát hướng mái, độ dốc và bóng che để chọn công suất phù hợp."
  ],
  "benefits": [],
  "whyUs": [
   "Thương hiệu năng lượng mặt trời của Công ty TNHH Giải pháp Kỹ thuật Đông Bắc",
   "Nhà thầu bảo trì cơ điện thuộc top 1 tại Quảng Ninh, theo giới thiệu của công ty",
   "Hàng trăm dự án lớn nhỏ tại khu vực Đông, Tây Bắc",
   "Dịch vụ trọn gói: tư vấn, khảo sát, thiết kế, thi công, bảo trì"
  ],
  "steps": [
   "Khảo sát mái và hóa đơn điện của gia đình",
   "Chọn giải pháp: hòa lưới hay hybrid có pin",
   "Thi công, đấu nối và nghiệm thu",
   "Hướng dẫn sử dụng và bảo trì"
  ]
 }
};

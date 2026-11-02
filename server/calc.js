// Tính điện mặt trời theo biểu giá điện sinh hoạt EVN – QĐ 1279/QĐ-BCT (6 bậc), VAT 8%. Sửa TIERS khi giá thay đổi.
export const TIERS = [[50, 1984], [50, 2050], [100, 2380], [100, 2998], [100, 3350], [1e9, 3460]];
export const VAT = 1.08;
const YIELD = { 'Quảng Ninh': 2.9, 'Hải Phòng': 2.9, 'Hà Nội': 2.85, 'Đà Nẵng': 3.5, 'TP. Hồ Chí Minh': 3.9 }; // kWh/kWp/ngày (ước tính)
const PRICE = { ton: 9.0, ngoi: 9.7 }; // triệu đồng/kWp (ước tính)
export const evnBill = (kwh) => { let r = kwh, c = 0, t = 0;
  TIERS.forEach(([n, p], i) => { const u = Math.min(r, n); if (u > 0) { c += u * p; r -= u; t = i; } }); return { money: c * VAT, tier: t }; };
export const evnKwh = (money) => { let x = money / VAT, k = 0;
  for (const [n, p] of TIERS) { if (x > n * p) { x -= n * p; k += n; } else { k += x / p; break; } } return k; };
export function calcSolar({ bill, dayRatio = 70, roof = 'ton', place = 'Hà Nội' }) {
  const kwh0 = evnKwh(bill), prod = kwh0 * dayRatio / 100, kwp = prod / (30 * (YIELD[place] || 2.85));
  const offset = prod * 0.9, kwh1 = Math.max(kwh0 - offset, 0), after = evnBill(kwh1), before = evnBill(kwh0);
  const saving = Math.max(bill - after.money, 0), year = saving * 12, cost = Math.round(kwp * (PRICE[roof] || 9) * 1e3) * 1000;
  const co2 = prod * 12 * 0.66 / 1000;
  return { bill, kwh0, prod, kwp, panels: Math.max(1, Math.round(kwp * 1000 / 620)), area: kwp * 5.4, inverter: Math.ceil(kwp), cost,
    offset, kwh1, bill1: after.money, tier0: before.tier, tier1: after.tier, saving, year, payback: year ? cost / year : 0,
    co2, trees: co2 * 1000 / 33, pct: bill ? saving / bill * 100 : 0, prices: TIERS.map((t) => t[1]) };
}

// Gói giải pháp gợi ý cho hộ gia đình (ước tính theo khu vực Quảng Ninh, 50% điện dùng ban ngày)
export function homePackages() {
  return [3, 5, 10].map((kwp) => { const gen = kwp * YIELD['Quảng Ninh'] * 30, cons = gen / 0.5;
    const saving = evnBill(cons).money - evnBill(Math.max(cons - gen * 0.9, 0)).money;
    return { kwp, panels: Math.ceil(kwp * 1000 / 620), gen: Math.round(gen), saving: Math.round(saving / 1000) * 1000 }; });
}
// Dự toán cho doanh nghiệp theo diện tích mái (khoảng 8 m² mái cho mỗi kWp, giá 7,5–9 triệu đồng/kWp: số ước tính)
export function calcBusiness({ area, place = 'Quảng Ninh' }) {
  const kwp = area / 8, gen = kwp * (YIELD[place] || 2.85) * 30, co2 = gen * 12 * 0.66 / 1000, r = (v) => Math.round(v / 1e6) * 1e6;
  return { area, kwp, panels: Math.max(1, Math.round(kwp * 1000 / 620)), inverter: Math.ceil(kwp), gen, costMin: r(kwp * 7.5e6), costMax: r(kwp * 9e6), co2, trees: co2 * 1000 / 33 };
}

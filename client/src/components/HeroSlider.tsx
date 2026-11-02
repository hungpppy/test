import { useEffect, useState } from 'react';
const slides = [{ k: 'NĂNG LƯỢNG', t: 'SẠCH – XANH' }, { k: 'TIẾT KIỆM', t: 'GIẢM TIỀN ĐIỆN MỖI THÁNG' }, { k: 'MỚI TỪ 26/6/2026', t: 'BÁN TỐI ĐA 50% ĐIỆN DƯ' }];
export default function HeroSlider() {
  const [i, setI] = useState(0); const go = (d: number) => setI((i + d + slides.length) % slides.length);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000); return () => clearInterval(t); }, []);
  return (<div className="slider"><button aria-label="Trước" onClick={() => go(-1)}>‹</button>
    <div className="slide"><small>{slides[i].k}</small><strong>{slides[i].t}</strong></div>
    <button aria-label="Sau" onClick={() => go(1)}>›</button>
    <div className="dots">{slides.map((_, n) => <i key={n} className={n === i ? 'on' : ''} onClick={() => setI(n)} />)}</div></div>);
}

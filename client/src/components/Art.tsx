// Hình minh họa vẽ bằng SVG (thay bằng ảnh thật khi có)
const O = '#F7941D', Y = '#FDB913', B = '#1F6FB5', G = '#0a7d3c';
export const Panel = ({ w = 120 }: { w?: number }) => (
  <svg width={w} viewBox="0 0 100 60" aria-hidden><rect width="100" height="60" rx="3" fill="#16324f" stroke="#cfd8e3" strokeWidth="2" />
    {[1, 2, 3, 4, 5].map((i) => <line key={'v' + i} x1={i * 16.6} y1="0" x2={i * 16.6} y2="60" stroke="#4a6f94" strokeWidth=".8" />)}
    {[1, 2, 3].map((i) => <line key={'h' + i} x1="0" y1={i * 15} x2="100" y2={i * 15} stroke="#4a6f94" strokeWidth=".8" />)}</svg>);
export function SolutionArt({ kind }: { kind: number }) {
  const arrow = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={O} strokeWidth="2" strokeDasharray="5 3" />;
  return (<svg viewBox="0 0 300 160" className="art" role="img" aria-label="Sơ đồ hệ thống">
    <defs><linearGradient id={'sk' + kind} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6ec1ff" /><stop offset="1" stopColor="#eaf7ff" /></linearGradient></defs>
    <rect width="300" height="160" fill={`url(#sk${kind})`} />
    <circle cx="40" cy="28" r="14" fill={Y} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1="40" y1="8" x2="40" y2="4" stroke={Y} strokeWidth="3" transform={`rotate(${a} 40 28)`} />)}
    <g transform="translate(70 40) skewX(-20)"><rect width="60" height="30" fill="#16324f" stroke="#fff" /><line x1="30" y1="0" x2="30" y2="30" stroke="#4a6f94" /><line x1="0" y1="15" x2="60" y2="15" stroke="#4a6f94" /></g>
    <polygon points="30,120 60,95 90,120" fill="#c0392b" /><rect x="38" y="120" width="44" height="28" fill="#fff" stroke="#ddd" />
    <rect x="125" y="78" width="36" height="46" rx="4" fill="#fff" stroke={O} strokeWidth="3" /><rect x="132" y="86" width="22" height="9" fill="#222" />
    {arrow(105, 62, 135, 78)}{arrow(90, 125, 125, 110)}
    {kind !== 1 && <g stroke="#555" strokeWidth="3"><line x1="240" y1="70" x2="240" y2="140" /><line x1="225" y1="95" x2="255" y2="95" /><line x1="230" y1="115" x2="250" y2="115" /></g>}
    {kind !== 1 && arrow(162, 100, 232, 100)}
    {kind !== 2 && <g><rect x="200" y="30" width="56" height="26" rx="3" fill="#e8e8e8" stroke="#888" /><rect x="212" y="36" width="12" height="14" fill={Y} /></g>}
    {kind !== 2 && arrow(161, 85, 200, 50)}</svg>);
}
export const HeroArt = () => (<svg className="heroart" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
  {Array.from({ length: 5 }, (_, r) => Array.from({ length: 9 }, (_, c) =>
    <rect key={r + '-' + c} x={40 + c * 80 - r * 18} y={80 + r * 44} width="72" height="38" fill="#16324f" opacity=".55" stroke="#fff6" transform={`skewX(-18)`} />))}</svg>);

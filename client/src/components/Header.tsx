import { Link, NavLink } from 'react-router-dom'; import Logo from './Logo'; import ThemeToggle from './ThemeToggle';
import { company as c } from '../config/company'; import { nav, NavItem } from '../config/data';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { logout } from '../store/authSlice';
function Item({ n, depth = 0 }: { n: NavItem; depth?: number }) {
  const mark = n.sub ? (depth ? ' ›' : ' ▾') : '';
  const plain = n.to.includes('#') || n.to.includes('?');
  return (<li>{plain ? <Link to={n.to}>{n.label}{mark}</Link> : <NavLink to={n.to} end={n.to === '/'}>{n.label}{mark}</NavLink>}
    {n.sub && <ul className="sub">{n.sub.map((s) => <Item key={s.label} n={s} depth={depth + 1} />)}</ul>}</li>);
}
export default function Header() {
  const user = useAppSelector((s) => s.auth.user); const d = useAppDispatch();
  return (<header>
    <div className="topbar"><span>🕗 {c.hours}</span><a href={`tel:${c.phone.replace(/\s/g, '')}`}>📞 {c.phone}</a><a href={`mailto:${c.email}`}>✉ {c.email}</a><span>📍 {c.address}</span></div>
    <nav className="nav"><Link to="/"><Logo /></Link><ul>{nav.map((n) => <Item key={n.label} n={n} />)}</ul>
      <div className="tools"><ThemeToggle />
        {user ? <>{user.role === 'admin' && <Link to="/quan-tri" className="linkbtn">Quản trị</Link>}<Link to="/tai-khoan" className="user">👤 {user.name}</Link><button className="linkbtn" onClick={() => d(logout())}>Đăng xuất</button></>
          : <><Link to="/dang-nhap" className="linkbtn">Đăng nhập</Link><Link to="/dang-ky" className="cta">Đăng ký</Link></>}</div></nav></header>);
}

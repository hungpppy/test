import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header'; import Footer from './components/Footer'; import { FloatingContact } from './components/Sections';
import Admin from './pages/Admin'; import KhaiToan from './pages/KhaiToan'; import AuthPage from './pages/AuthPage'; import Account from './pages/Account'; import InstallCost from './pages/InstallCost'; import { fetchMe } from './store/authSlice'; import About from './pages/About'; import ProjectsPage, { ProjectDetail } from './pages/ProjectsPage'; import { NewsList, NewsDetail } from './pages/NewsPages'; import GiaiPhapDauTu from './pages/GiaiPhapDauTu'; import Home from './pages/Home'; import Products from './pages/Products'; import Contact from './pages/Contact';
import { useEffect } from 'react'; import Banner from './components/Banner'; import { useAppDispatch } from './store/hooks'; import { visit } from './store/visits';
function ScrollManager() { // cuộn lên đầu khi đổi trang, hoặc tới #mục khi có hash
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50); else window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}
export default function App() {
  const dispatch = useAppDispatch(); useEffect(() => { dispatch(visit()); dispatch(fetchMe()); }, [dispatch]);
  return (<><Banner messages={['Khảo sát miễn phí tại Quảng Ninh', 'Tư vấn thiết kế hệ thống điện mặt trời', 'Bảo hành thiết bị dài hạn']} /><ScrollManager /><Header /><main><Routes>
    <Route path="/" element={<Home />} /><Route path="/san-pham" element={<Products />} /><Route path="/gioi-thieu" element={<About />} /><Route path="/du-an" element={<ProjectsPage />} /><Route path="/du-an/:id" element={<ProjectDetail />} /><Route path="/giai-phap-dau-tu/:kind" element={<GiaiPhapDauTu />} /><Route path="/tin-tuc" element={<NewsList />} /><Route path="/tin-tuc/:slug" element={<NewsDetail />} /><Route path="/chi-phi-lap-dat" element={<InstallCost />} /><Route path="/chi-phi-lap-dat/:slug" element={<InstallCost />} /><Route path="/dang-nhap" element={<AuthPage mode="login" />} /><Route path="/dang-ky" element={<AuthPage mode="register" />} /><Route path="/nhan-vien" element={<AuthPage mode="staff" />} /><Route path="/quan-tri" element={<Admin />} /><Route path="/khai-toan" element={<KhaiToan />} /><Route path="/tai-khoan" element={<Account />} /><Route path="/lien-he" element={<Contact />} /><Route path="*" element={<section className="wrap"><h1>Không tìm thấy trang</h1></section>} />
  </Routes></main><Footer /><FloatingContact /></>);
}

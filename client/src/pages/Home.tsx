import { HeroArt } from '../components/Art'; import HeroSlider from '../components/HeroSlider'; import Calculator from '../components/Calculator'; import Stats from '../components/Stats'; import Products from './Products'; import Contact from './Contact';
import { Intro, Solutions, Invest, Partners } from '../components/Sections'; import { ProjectsHome, NewsHome } from '../components/HomeFeeds';
import { stats } from '../config/data'; import { company as c } from '../config/company';
export default function Home() {
  return (<><section className="hero"><HeroArt /><div><HeroSlider /><p>{c.slogan}. Thiết kế và lắp đặt điện mặt trời cho hộ gia đình, doanh nghiệp tại Quảng Ninh và toàn quốc.</p></div><Calculator /></section>
    <Intro /><Stats items={stats} /><Solutions /><Invest /><Products embedded /><ProjectsHome /><Partners /><NewsHome />
    <div id="lien-he-nhanh"><Contact /></div></>);
}

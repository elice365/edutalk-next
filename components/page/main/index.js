import { route } from '../../../styles/route';
import MainHeader from './sections/Header';
import HeroSection from './sections/Hero';
import FeaturesSection from './sections/Features';
import CtaSection from './sections/Cta';
import MainFooter from './sections/Footer';



export default function Index() {
  return (
    <div className={route.layout.container}>
      <MainHeader />
      <main id="main-content" className={route.main.container}>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <MainFooter />
    </div>
  );
}
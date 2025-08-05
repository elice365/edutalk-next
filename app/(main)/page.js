import CtaSection from '@/components/page/main/sections/Cta';
import FeaturesSection from '@/components/page/main/sections/Features';
import MainFooter from '@/components/page/main/sections/Footer';
import MainHeader from '@/components/page/main/sections/Header';
import HeroSection from '@/components/page/main/sections/Hero';
import { route } from '@/styles/route';



export default function Home() {
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
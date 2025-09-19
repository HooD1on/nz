'use client'

import {
  HeroSection,
  PopularDestinations,
  SpecialPackages,
  QualityStats,
  Testimonials,
  FAQ,
  Subscribe
} from '../components/home'
import '@/styles/pages/home/index.css'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularDestinations />
      <SpecialPackages />
      <QualityStats />
      <Testimonials />
      <FAQ />
      <Subscribe />
    </>
  );
}

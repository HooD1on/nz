'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  HeroSection, 
  PopularDestinations, 
  Features, 
  SpecialPackages,
  QualityStats,
  Testimonials,
  FAQ,
  Subscribe
} from '../components/home'
import '../styles/home.css'

export default function HomePage() {
  // FAQ 切换函数
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  
  const toggleFaq = (index: number): void => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Navbar />
      
      <HeroSection />
      
      <section className="destinations section">
        <div className="container">
          <h2 className="section-title">POPULAR DESTINATIONS</h2>
          <p className="section-description">Explore our top destinations right from our travelers' shared reviews.</p>
          
          <div className="destination-grid">
            <div className="destination-card italy">
              <h3 className="destination-title">Italy</h3>
              <p className="package-count"><i>📍</i> 30 Packages</p>
            </div>
            
            <div className="destination-card switzerland">
              <h3 className="destination-title">Switzerland</h3>
              <p className="destination-desc">Experience the beauty of the Swiss Confederation, in a landscaped country filled with majestic mountain peaks of Europe.</p>
              <div className="destination-buttons">
                <Link href="/booking" className="btn btn-outline">Book Now</Link>
                <Link href="/destinations/switzerland" className="btn">Learn More</Link>
              </div>
            </div>
            
            <div className="destination-card greece">
              <h3 className="destination-title">Greece</h3>
              <p className="package-count"><i>📍</i> 20 Packages</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                </svg>
              </div>
              <h3 className="feature-title">Customer Insight</h3>
              <p className="feature-desc">We deliver the best service because we listen to our customers.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 18a5 5 0 0 0-10 0"></path>
                  <line x1="12" y1="9" x2="12" y2="2"></line>
                  <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                  <line x1="19.78" y1="10.22" x2="18.36" y2="11.64"></line>
                  <line x1="1" y1="18" x2="23" y2="18"></line>
                </svg>
              </div>
              <h3 className="feature-title">Authentic Adventure</h3>
              <p className="feature-desc">We deliver the real adventure that matters for your experience.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="feature-title">Expert Guides</h3>
              <p className="feature-desc">We provide expert guides for every destination in our catalog.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="feature-title">Time Flexibility</h3>
              <p className="feature-desc">We welcome time flexibility ensuring the best experience.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="packages section">
        <div className="container">
          <SpecialPackages />
          <QualityStats />
        </div>
      </section>
      
      <Testimonials />
      
      <FAQ />
      
      <Subscribe />
      
      <Footer />
    </>
  );
}

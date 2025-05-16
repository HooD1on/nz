import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-nav">
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Destinations</h4>
            <ul className="footer-nav-links">
              <li><Link href="/destinations/europe">Europe</Link></li>
              <li><Link href="/destinations/asia">Asia</Link></li>
              <li><Link href="/destinations/africa">Africa</Link></li>
              <li><Link href="/destinations/americas">Americas</Link></li>
            </ul>
          </div>
          
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Tours</h4>
            <ul className="footer-nav-links">
              <li><Link href="/packages/adventure">Adventure</Link></li>
              <li><Link href="/packages/cultural">Cultural</Link></li>
              <li><Link href="/packages/beach">Beach</Link></li>
              <li><Link href="/packages/wildlife">Wildlife</Link></li>
            </ul>
          </div>
          
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">About</h4>
            <ul className="footer-nav-links">
              <li><Link href="/about/story">Our Story</Link></li>
              <li><Link href="/about/team">Team</Link></li>
              <li><Link href="/about/careers">Careers</Link></li>
            </ul>
          </div>
          
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Blog</h4>
            <ul className="footer-nav-links">
              <li><Link href="/blog">Latest Posts</Link></li>
              <li><Link href="/blog/travel-tips">Travel Tips</Link></li>
              <li><Link href="/blog/destinations">Destinations</Link></li>
            </ul>
          </div>
          
          <div className="footer-nav-col">
            <h4 className="footer-nav-title">Contact</h4>
            <ul className="footer-nav-links">
              <li><Link href="/contact/support">Support</Link></li>
              <li><Link href="/contact/partners">Partners</Link></li>
              <li><Link href="/contact/press">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            Copyright © 2023 VacaSky. All rights reserved.
          </div>
          
          <div className="footer-social">
            <Link href="https://facebook.com" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link href="https://twitter.com" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </Link>
            <Link href="https://instagram.com" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
          </div>
          
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
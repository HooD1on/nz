import Link from 'next/link'

export default function PopularDestinations() {
  return (
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
  )
} 
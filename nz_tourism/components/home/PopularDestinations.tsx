import Link from 'next/link'

export default function PopularDestinations() {
  return (
    <section className="destinations section">
      <div className="container">
        <h2 className="section-title">POPULAR DESTINATIONS</h2>
        <p className="section-description">Explore our top destinations right from our travelers' shared reviews.</p>
        
        <div className="destination-grid">
          <div className="card card--destination italy">
            <h3 className="card__title">Italy</h3>
            <p className="card__meta"><i>📍</i> 30 Packages</p>
          </div>
          
          <div className="card card--destination switzerland">
            <h3 className="card__title">Switzerland</h3>
            <p className="card__description">Experience the beauty of the Swiss Confederation, in a landscaped country filled with majestic mountain peaks of Europe.</p>
            <div className="destination-buttons">
              <Link href="/booking" className="btn btn--outline">Book Now</Link>
              <Link href="/destinations/switzerland" className="btn btn--primary">Learn More</Link>
            </div>
          </div>
          
          <div className="card card--destination greece">
            <h3 className="card__title">Greece</h3>
            <p className="card__meta"><i>📍</i> 20 Packages</p>
          </div>
        </div>
      </div>
    </section>
  )
}
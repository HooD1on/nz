import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const packages = [
  {
    id: 1,
    title: 'North Island Explorer',
    name: 'Auckland to Wellington',
    description: 'Discover the beauty of New Zealand\'s North Island, from the vibrant city of Auckland to the cultural capital Wellington.',
    image: '/images/north-island.jpg'
  },
  {
    id: 2,
    title: 'South Island Adventure',
    name: 'Queenstown to Christchurch',
    description: 'Experience the stunning landscapes of the South Island, including the adventure capital Queenstown and the garden city Christchurch.',
    image: '/images/south-island.jpg'
  },
  {
    id: 3,
    title: 'Maori Culture Experience',
    name: 'Rotorua Cultural Tour',
    description: 'Immerse yourself in Maori culture with traditional performances, geothermal wonders, and authentic cultural experiences.',
    image: '/images/maori-culture.jpg'
  }
];

const SpecialPackages = () => {
  return (
    <section className="packages">
      <div className="container">
        <div className="package-header">
          <h2>Special Travel Packages</h2>
          <p>Explore our curated selection of unique travel experiences in New Zealand</p>
          <Link href="/packages" className="see-more">
            View All Packages
          </Link>
        </div>
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card" style={{ backgroundImage: `url(${pkg.image})` }}>
              <span className="package-number">{pkg.id}</span>
              <h3 className="package-title">{pkg.title}</h3>
              <p className="package-name">{pkg.name}</p>
              <p className="package-desc">{pkg.description}</p>
              <Link href={`/packages/${pkg.id}`} className="btn">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialPackages; 
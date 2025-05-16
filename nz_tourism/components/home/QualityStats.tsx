import React from 'react';

const stats = [
  {
    number: '10,000+',
    label: 'Happy Travelers'
  },
  {
    number: '500+',
    label: 'Destinations'
  },
  {
    number: '98%',
    label: 'Satisfaction Rate'
  },
  {
    number: '24/7',
    label: 'Customer Support'
  }
];

const QualityStats = () => {
  return (
    <section className="quality">
      <div className="container">
        <div className="quality-header">
          <h2 className="quality-title">Our Quality Standards</h2>
          <p className="quality-desc">
            We are committed to providing the highest quality travel experiences
            for our customers, backed by years of expertise and dedication.
          </p>
        </div>
        <div className="quality-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityStats; 
import React from 'react';
import { FaPlane, FaHotel, FaUtensils, FaCamera } from 'react-icons/fa';

const features = [
  {
    icon: <FaPlane className="feature-icon" />,
    title: 'Flights',
    description: 'Find the best flight deals to New Zealand from major cities worldwide.'
  },
  {
    icon: <FaHotel className="feature-icon" />,
    title: 'Accommodation',
    description: 'Choose from a wide range of hotels, motels, and luxury resorts.'
  },
  {
    icon: <FaUtensils className="feature-icon" />,
    title: 'Dining',
    description: 'Experience New Zealand\'s unique cuisine and world-class restaurants.'
  },
  {
    icon: <FaCamera className="feature-icon" />,
    title: 'Activities',
    description: 'Discover exciting activities and attractions across the country.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              {feature.icon}
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 
'use client';

import { useState } from 'react';
import DestinationHeader from './DestinationHeader';
import DestinationDetails from './DestinationDetails';
import DestinationGallery from './DestinationGallery';
import DestinationInfo from './DestinationInfo';
import RelatedPackages from './RelatedPackages';
import DestinationAction from './DestinationAction';
import ReviewSection from './ReviewSection';
import '../../styles/destination.css';

interface DestinationPageProps {
  destination: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    location: string;
    rating: number;
    reviewCount: number;
    description: string;
    highlights: string[];
    bestTimeToVisit: string;
    weather: string;
    transportation: string;
    food: string;
    accommodation: string;
    customs: string;
    language: string;
    currency: string;
    timeZone: string;
    images: {
      url: string;
      alt: string;
    }[];
    reviews: {
      id: string;
      userName: string;
      userAvatar: string;
      content: string;
      rating: number;
      date: string;
      images?: string[];
    }[];
  };
  relatedPackages: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
  }[];
}

const DestinationPage: React.FC<DestinationPageProps> = ({
  destination,
  relatedPackages
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: '概览' },
    { id: 'gallery', name: '图片' },
    { id: 'info', name: '详细信息' },
    { id: 'reviews', name: '评论' },
    { id: 'packages', name: '相关套餐' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="destination-page">
      <div className="destination-container">
        <DestinationHeader
          title={destination.title}
          subtitle={destination.subtitle}
          imageUrl={destination.imageUrl}
          location={destination.location}
          rating={destination.rating}
          reviewCount={destination.reviewCount}
        />
        
        <div className="destination-nav-container">
          <div className="destination-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="destination-content">
          <div className="page-layout">
            <div className="main-content">
              <section id="overview" className="content-section">
                <h2 className="section-title">目的地概览</h2>
                <DestinationDetails
                  description={destination.description}
                  highlights={destination.highlights}
                  bestTimeToVisit={destination.bestTimeToVisit}
                  weather={destination.weather}
                  language={destination.language}
                  currency={destination.currency}
                  timeZone={destination.timeZone}
                />
              </section>
              
              <section id="gallery" className="content-section">
                <h2 className="section-title">图片展示</h2>
                <DestinationGallery images={destination.images} />
              </section>
              
              <section id="info" className="content-section">
                <h2 className="section-title">详细信息</h2>
                <DestinationInfo
                  weather={destination.weather}
                  transportation={destination.transportation}
                  food={destination.food}
                  accommodation={destination.accommodation}
                  customs={destination.customs}
                />
              </section>
              
              <section id="reviews" className="content-section">
                <h2 className="section-title">旅客评论</h2>
                <ReviewSection
                  destinationId={destination.id}
                  reviews={destination.reviews}
                  averageRating={destination.rating}
                  totalReviews={destination.reviewCount}
                />
              </section>
              
              <section id="packages" className="content-section">
                <h2 className="section-title">相关套餐</h2>
                <RelatedPackages packages={relatedPackages} />
              </section>
            </div>
            
            <div className="sidebar">
              <div className="sidebar-sticky">
                <DestinationAction
                  destinationId={destination.id}
                  destinationTitle={destination.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage; 
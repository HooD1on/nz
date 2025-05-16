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
        
        <div className="destination-content">
          <div className="page-layout">
            <div className="main-content">
              <DestinationDetails
                description={destination.description}
                highlights={destination.highlights}
                bestTimeToVisit={destination.bestTimeToVisit}
                weather={destination.weather}
                language={destination.language}
                currency={destination.currency}
                timeZone={destination.timeZone}
              />
              
              <DestinationGallery images={destination.images} />
              
              <DestinationInfo
                weather={destination.weather}
                transportation={destination.transportation}
                food={destination.food}
                accommodation={destination.accommodation}
                customs={destination.customs}
              />
              
              <ReviewSection
                destinationId={destination.id}
                reviews={destination.reviews}
                averageRating={destination.rating}
                totalReviews={destination.reviewCount}
              />
              
              <RelatedPackages packages={relatedPackages} />
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
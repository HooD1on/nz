// 1. 修复 nz_tourism/components/package/PackageDetailsPage.tsx 文件

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PackageData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  includes: string[];
  highlights: string[];
  itinerary?: {
    day: number;
    title: string;
    activities: string[];
  }[];
}

interface PackageDetailsPageProps {
  packageData: PackageData;
}

export const PackageDetailsPage = ({ packageData }: PackageDetailsPageProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [travelers, setTravelers] = useState(2);
  const router = useRouter();

  // 🔥 修复：更正预订页面路径
  const handleBookNow = () => {
    router.push(`/packages/${packageData.id}/booking?travelers=${travelers}`);
  };

  const totalPrice = packageData.price * travelers;

  return (
    <div className="package-details">
      {/* Hero Section */}
      <div className="package-hero">
        <div className="hero-image">
          <Image
            src={packageData.imageUrl}
            alt={packageData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="hero-overlay" />
        </div>
        
        <div className="hero-content">
          <div className="container mx-auto px-4">
            <div className="hero-text">
              <h1 className="hero-title">{packageData.title}</h1>
              <p className="hero-subtitle">{packageData.subtitle}</p>
              
              <div className="hero-meta">
                <div className="rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star ${i < Math.floor(packageData.rating) ? 'filled' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="rating-text">
                    {packageData.rating} ({packageData.reviewCount} 条评价)
                  </span>
                </div>
                
                <div className="duration">
                  <svg className="duration-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{packageData.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="package-content">
        <div className="container mx-auto px-4">
          <div className="content-grid">
            {/* Left Column - Details */}
            <div className="content-main">
              {/* Navigation Tabs */}
              <div className="content-nav">
                <button
                  className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  概览
                </button>
                <button
                  className={`nav-tab ${activeTab === 'includes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('includes')}
                >
                  包含内容
                </button>
                {packageData.itinerary && packageData.itinerary.length > 0 && (
                  <button
                    className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    行程安排
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <h2>套餐介绍</h2>
                    <p>{packageData.description}</p>
                    
                    {packageData.highlights && packageData.highlights.length > 0 && (
                      <>
                        <h3>行程亮点</h3>
                        <ul className="highlights-list">
                          {packageData.highlights.map((highlight, index) => (
                            <li key={index} className="highlight-item">
                              <svg className="highlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="includes-content">
                    <h2>套餐包含</h2>
                    <ul className="includes-list">
                      {packageData.includes.map((item, index) => (
                        <li key={index} className="include-item">
                          <svg className="include-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'itinerary' && packageData.itinerary && (
                  <div className="itinerary-content">
                    <h2>详细行程</h2>
                    <div className="itinerary-list">
                      {packageData.itinerary.map((day, index) => (
                        <div key={index} className="itinerary-day">
                          <div className="day-header">
                            <span className="day-number">第{day.day}天</span>
                            <h3 className="day-title">{day.title}</h3>
                          </div>
                          <ul className="day-activities">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="activity-item">
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="content-sidebar">
              <div className="booking-card">
                <div className="price-info">
                  <div className="price-main">
                    <span className="price-amount">${packageData.price}</span>
                    <span className="price-unit">/ 人</span>
                  </div>
                  <p className="price-note">起价，根据出行时间和人数调整</p>
                </div>

                <div className="travelers-selector">
                  <label htmlFor="travelers">出行人数</label>
                  <div className="travelers-control">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="travelers-btn"
                    >
                      -
                    </button>
                    <span className="travelers-count">{travelers}</span>
                    <button
                      type="button"
                      onClick={() => setTravelers(travelers + 1)}
                      className="travelers-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-price">
                  <div className="total-label">总价</div>
                  <div className="total-amount">${totalPrice}</div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="book-now-btn"
                >
                  立即预订
                </button>

                <div className="booking-features">
                  <div className="feature-item">
                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>免费取消</span>
                  </div>
                  <div className="feature-item">
                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>即时确认</span>
                  </div>
                  <div className="feature-item">
                    <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7客服支持</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
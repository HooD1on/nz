// nz_tourism/components/package/PackageDetailsPage.tsx
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

  const handleBookNow = () => {
    // 跳转到预订页面，传递套餐ID
    router.push(`/booking?packageId=${packageData.id}&travelers=${travelers}`);
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
                <button
                  className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                >
                  行程安排
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <h2>套餐描述</h2>
                    <p className="description">{packageData.description}</p>
                    
                    <h3>行程亮点</h3>
                    <ul className="highlights-list">
                      {packageData.highlights.map((highlight, index) => (
                        <li key={index} className="highlight-item">
                          <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'includes' && (
                  <div className="includes-content">
                    <h2>套餐包含</h2>
                    <ul className="includes-list">
                      {packageData.includes.map((item, index) => (
                        <li key={index} className="include-item">
                          <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="itinerary-content">
                    <h2>详细行程</h2>
                    {packageData.itinerary && packageData.itinerary.length > 0 ? (
                      <div className="itinerary-list">
                        {packageData.itinerary.map((day) => (
                          <div key={day.day} className="itinerary-day">
                            <div className="day-header">
                              <span className="day-number">第{day.day}天</span>
                              <h3 className="day-title">{day.title}</h3>
                            </div>
                            <ul className="day-activities">
                              {day.activities.map((activity, index) => (
                                <li key={index} className="activity">
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-itinerary">详细行程安排将在预订确认后提供。</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="booking-sidebar">
              <div className="booking-card">
                <div className="price-section">
                  <span className="price-label">起价</span>
                  <span className="price-value">¥{packageData.price}</span>
                  <span className="price-unit">/ 人</span>
                </div>

                <div className="travelers-section">
                  <label htmlFor="travelers">出行人数</label>
                  <div className="travelers-input">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="travelers-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="travelers"
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="travelers-count"
                    />
                    <button
                      type="button"
                      onClick={() => setTravelers(travelers + 1)}
                      className="travelers-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-section">
                  <div className="total-row">
                    <span>总价格</span>
                    <span className="total-price">¥{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="book-now-btn"
                >
                  立即预订
                </button>

                <div className="booking-note">
                  <p>• 价格包含所有基础服务</p>
                  <p>• 支持24小时客服</p>
                  <p>• 免费取消政策</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .package-details {
          min-height: 100vh;
          background: #f9fafb;
        }

        .package-hero {
          position: relative;
          height: 60vh;
          min-height: 400px;
          overflow: hidden;
        }

        .hero-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
          z-index: 1;
        }

        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 2rem 0;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .hero-meta {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
        }

        .star {
          width: 1.25rem;
          height: 1.25rem;
          color: #fbbf24;
        }

        .star.filled {
          color: #f59e0b;
        }

        .duration {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .duration-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .package-content {
          padding: 2rem 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .content-nav {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .nav-tab {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .nav-tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-content {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .highlights-list,
        .includes-list {
          list-style: none;
          padding: 0;
        }

        .highlight-item,
        .include-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .check-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #10b981;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }

        .itinerary-day {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .day-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .day-number {
          background: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .day-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .day-activities {
          list-style: none;
          padding: 0;
        }

        .activity {
          padding: 0.5rem 0;
          padding-left: 1rem;
          border-left: 2px solid #e5e7eb;
          margin-left: 1rem;
          position: relative;
        }

        .activity::before {
          content: '';
          position: absolute;
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
        }

        .booking-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .booking-card {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }

        .price-section {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .price-label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .price-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .price-unit {
          font-size: 1rem;
          color: #6b7280;
        }

        .travelers-section {
          margin-bottom: 1.5rem;
        }

        .travelers-section label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .travelers-input {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
        }

        .travelers-btn {
          width: 3rem;
          height: 3rem;
          border: none;
          background: #f9fafb;
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        .travelers-btn:hover {
          background: #e5e7eb;
        }

        .travelers-count {
          flex: 1;
          height: 3rem;
          border: none;
          text-align: center;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .total-section {
          margin-bottom: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
        }

        .book-now-btn {
          width: 100%;
          padding: 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 1rem;
        }

        .book-now-btn:hover {
          background: #2563eb;
        }

        .booking-note {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .booking-note p {
          margin: 0.25rem 0;
        }

        .no-itinerary {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .booking-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};
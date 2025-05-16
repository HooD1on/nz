'use client';

import Image from 'next/image';
import Link from 'next/link';

interface DestinationHeaderProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviewCount: number;
}

const DestinationHeader: React.FC<DestinationHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  location,
  rating,
  reviewCount
}) => {
  const scrollToContent = () => {
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
      overviewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="header-container">
      <div className="header-image">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="header-image-content"
          priority
        />
        <div className="header-overlay">
          <div className="breadcrumb">
            <Link href="/" className="breadcrumb-link">首页</Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/destinations" className="breadcrumb-link">目的地</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{title}</span>
          </div>
          
          <div className="header-content">
            <div>
              <h1 className="header-title">{title}</h1>
              <p className="header-subtitle">{subtitle}</p>
              <div className="header-meta">
                <div className="header-location">
                  <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}</span>
                </div>
                <div className="header-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star-icon ${i < Math.floor(rating) ? 'filled' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="rating-text">
                    {rating.toFixed(1)} ({reviewCount} 条评价)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-scroll-hint" onClick={scrollToContent}>
            <span>向下滚动查看详情</span>
            <svg className="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationHeader; 
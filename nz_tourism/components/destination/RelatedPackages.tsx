'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

interface RelatedPackagesProps {
  packages: Package[];
}

const RelatedPackages: React.FC<RelatedPackagesProps> = ({ packages }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateArrows = () => {
      if (!containerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    containerRef.current?.addEventListener('scroll', updateArrows);
    updateArrows();

    return () => {
      containerRef.current?.removeEventListener('scroll', updateArrows);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const clientWidth = containerRef.current.clientWidth;
    const scrollAmount = clientWidth * 0.8;
    
    const targetPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    containerRef.current.scrollTo({
      left: targetPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(targetPosition);
  };

  return (
    <div className="related-packages">
      <div className="packages-header">
        <h2 className="section-title">相关旅游套餐</h2>
        <div className="package-controls">
          <button 
            className={`control-button ${!showLeftArrow ? 'disabled' : ''}`}
            onClick={() => scroll('left')}
            disabled={!showLeftArrow}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className={`control-button ${!showRightArrow ? 'disabled' : ''}`}
            onClick={() => scroll('right')}
            disabled={!showRightArrow}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="packages-carousel" ref={containerRef}>
        {packages.map((pkg) => (
          <Link key={pkg.id} href={`/packages/${pkg.id}`} className="package-card">
            <div className="package-image">
              <Image
                src={pkg.imageUrl}
                alt={pkg.title}
                fill
                sizes="(max-width: 640px) 100vw, 350px"
                className="package-image-content"
              />
              <div className="package-badge">热门</div>
            </div>
            <div className="package-content">
              <h3 className="package-title">{pkg.title}</h3>
              <p className="package-description">{pkg.description}</p>
              <div className="package-meta">
                <div className="package-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star-icon ${i < Math.floor(pkg.rating) ? 'filled' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="rating-text">
                    {pkg.rating.toFixed(1)} ({pkg.reviewCount} 条评价)
                  </span>
                </div>
                <div className="package-price">
                  <span className="price-label">起价</span>
                  <span className="price-value">¥{pkg.price}</span>
                </div>
              </div>
              <div className="package-duration">
                <svg className="duration-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{pkg.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="packages-footer">
        <Link href="/packages" className="view-all-button">
          查看全部套餐
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RelatedPackages; 
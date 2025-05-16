'use client';

import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <div className="related-packages">
      <h2 className="section-title">相关旅游套餐</h2>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <Link key={pkg.id} href={`/packages/${pkg.id}`} className="package-card">
            <div className="package-image">
              <Image
                src={pkg.imageUrl}
                alt={pkg.title}
                fill
                className="package-image-content"
              />
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
                  <span className="price-value">${pkg.price}</span>
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
    </div>
  );
};

export default RelatedPackages; 
import Image from 'next/image';
import Link from 'next/link';

interface DestinationCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  location: string;
  slug: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  description,
  imageUrl,
  price,
  rating,
  location,
  slug
}) => {
  return (
    <Link href={`/destinations/${slug}`} className="destination-card">
      <div className="destination-image-wrapper">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="destination-image"
        />
      </div>
      <div className="destination-content">
        <h3 className="destination-title">{title}</h3>
        <p className="destination-description">{description}</p>
        <div className="destination-meta">
          <div className="destination-rating">
            <span className="rating-star">★</span>
            <span className="rating-text">{rating}</span>
          </div>
          <div className="destination-price">
            ¥{price}
          </div>
        </div>
        <div className="destination-location">
          <svg className="location-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard; 
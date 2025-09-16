import Image from 'next/image';
import Link from 'next/link';

interface PackageCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  includes: string[];
  slug: string;
  featured?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  description,
  imageUrl,
  price,
  duration,
  includes,
  slug,
  featured = false
}) => {
  return (
    <div className={`card card--package ${featured ? 'card--featured' : ''} card--interactive`}>
      <div className="card__image">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {featured && (
          <div className="card__badge">
            热门推荐
          </div>
        )}
      </div>
      
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
        
        <div className="card__meta">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{duration}</span>
        </div>
        
        <div className="space-y-2 mb-6">
          {includes.map((item, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="card__footer">
          <div className="card__price">
            ${price}
          </div>
          <Link 
            href={`/packages/${slug}`}
            className="btn btn--primary"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
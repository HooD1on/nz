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
    <div className={`
      bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300
      ${featured ? 'border-2 border-primary-500 transform hover:-translate-y-2' : 'hover:shadow-xl'}
    `}>
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        {featured && (
          <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            热门推荐
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-600">{duration}</span>
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
        
        <div className="flex items-center justify-between">
          <div className="text-primary-600 font-bold text-2xl">
            ${price}
          </div>
          <Link 
            href={`/packages/${slug}`}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard; 
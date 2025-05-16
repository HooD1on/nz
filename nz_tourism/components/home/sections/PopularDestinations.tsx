import SectionTitle from '../common/SectionTitle';
import DestinationCard from '../ui/DestinationCard';

const popularDestinations = [
  {
    title: "皇后镇",
    description: "新西兰最受欢迎的旅游目的地，以其壮丽的自然风光和丰富的户外活动而闻名。",
    imageUrl: "/images/destinations/queenstown.jpg",
    price: 1299,
    rating: 4.8,
    location: "新西兰南岛",
    slug: "queenstown"
  },
  {
    title: "罗托鲁瓦",
    description: "体验毛利文化和地热奇观的最佳地点，享受温泉和自然美景。",
    imageUrl: "/images/destinations/rotorua.jpg",
    price: 899,
    rating: 4.6,
    location: "新西兰北岛",
    slug: "rotorua"
  },
  {
    title: "米尔福德峡湾",
    description: "世界第八大自然奇观，壮丽的峡湾和原始自然风光。",
    imageUrl: "/images/destinations/milford-sound.jpg",
    price: 1499,
    rating: 4.9,
    location: "新西兰南岛",
    slug: "milford-sound"
  }
];

const PopularDestinations = () => {
  return (
    <section className="destinations-section">
      <div className="destinations-container">
        <SectionTitle 
          title="热门目的地"
          subtitle="探索新西兰最受欢迎的旅游胜地，开启您的完美旅程"
        />
        
        <div className="destinations-grid">
          {popularDestinations.map((destination) => (
            <DestinationCard
              key={destination.slug}
              {...destination}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations; 
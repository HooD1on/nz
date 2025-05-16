'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DestinationFilter from '../../components/destination/DestinationFilter';
import '../../styles/destinations.css';

// 新西兰热门目的地数据
const popularDestinations = [
  {
    title: "皇后镇",
    description: "新西兰最受欢迎的旅游目的地，以其壮丽的自然风光和丰富的户外活动而闻名。被誉为'冒险之都'，提供跳伞、高空弹跳、喷射快艇等刺激活动。",
    imageUrl: "https://images.pexels.com/photos/7919/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1000",
    price: 1299,
    rating: 4.8,
    location: "新西兰南岛",
    slug: "queenstown",
    region: "south-island",
    activityTypes: ["adventure", "nature"],
    bestSeasons: ["summer", "spring"]
  },
  {
    title: "罗托鲁瓦",
    description: "体验毛利文化和地热奇观的最佳地点，享受温泉和自然美景。这里的地热活动非常活跃，有间歇泉、泥浆池和彩色地热湖泊。",
    imageUrl: "https://images.pexels.com/photos/9800002/pexels-photo-9800002.jpeg?auto=compress&cs=tinysrgb&w=1000",
    price: 899,
    rating: 4.6,
    location: "新西兰北岛",
    slug: "rotorua",
    region: "north-island",
    activityTypes: ["culture", "nature"],
    bestSeasons: ["summer", "autumn"]
  },
  {
    title: "米尔福德峡湾",
    description: "世界第八大自然奇观，壮丽的峡湾和原始自然风光。被《鲁道夫·古德利比》誉为'世界第八大奇迹'，峭壁、瀑布和原始雨林令人叹为观止。",
    imageUrl: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1000",
    price: 1499,
    rating: 4.9,
    location: "新西兰南岛",
    slug: "milford-sound",
    region: "south-island",
    activityTypes: ["nature"],
    bestSeasons: ["summer", "autumn"]
  },
  {
    title: "奥克兰",
    description: "新西兰最大的城市，拥有丰富的文化景点、美食和活动。这座城市建在火山上，被两个港湾环绕，拥有'风帆之都'的美誉。",
    imageUrl: "https://images.pexels.com/photos/5343851/pexels-photo-5343851.jpeg?auto=compress&cs=tinysrgb&w=1000",
    price: 799,
    rating: 4.5,
    location: "新西兰北岛",
    slug: "auckland",
    region: "north-island",
    activityTypes: ["food-wine", "culture"],
    bestSeasons: ["summer", "spring"]
  },
  {
    title: "霍比特村",
    description: "《指环王》和《霍比特人》电影中的霍比特人故乡场景，让人仿佛置身于中土世界。完整保留了44个霍比特洞和绿龙酒吧等场景。",
    imageUrl: "https://images.pexels.com/photos/831243/pexels-photo-831243.jpeg?auto=compress&cs=tinysrgb&w=1000",
    price: 1099,
    rating: 4.7,
    location: "新西兰北岛",
    slug: "hobbiton",
    region: "north-island",
    activityTypes: ["culture"],
    bestSeasons: ["summer", "spring", "autumn"]
  },
  {
    title: "但尼丁",
    description: "拥有独特的苏格兰遗产和维多利亚建筑风格的城市。这里有世界最陡峭的街道鲍德温街，和美丽的奥塔哥半岛野生动物保护区。",
    imageUrl: "https://images.pexels.com/photos/2923595/pexels-photo-2923595.jpeg?auto=compress&cs=tinysrgb&w=1000",
    price: 949,
    rating: 4.4,
    location: "新西兰南岛",
    slug: "dunedin",
    region: "south-island",
    activityTypes: ["culture", "nature"],
    bestSeasons: ["summer", "autumn"]
  }
];

// 活动类型映射
const activityTypeLabels = {
  'adventure': '冒险活动',
  'nature': '自然风光',
  'culture': '文化体验',
  'food-wine': '美食葡萄酒'
};

export default function DestinationsPage() {
  const [filteredDestinations, setFilteredDestinations] = useState(popularDestinations);
  const [filters, setFilters] = useState({
    region: '',
    activityType: '',
    season: '',
    searchQuery: ''
  });

  const handleFilterChange = (newFilters: {
    region: string;
    activityType: string;
    season: string;
    searchQuery: string;
  }) => {
    setFilters(newFilters);
    
    // 应用筛选条件
    let results = [...popularDestinations];
    
    // 按区域筛选
    if (newFilters.region) {
      results = results.filter(dest => dest.region === newFilters.region);
    }
    
    // 按活动类型筛选
    if (newFilters.activityType) {
      results = results.filter(dest => 
        dest.activityTypes.includes(newFilters.activityType)
      );
    }
    
    // 按季节筛选
    if (newFilters.season) {
      results = results.filter(dest => 
        dest.bestSeasons.includes(newFilters.season)
      );
    }
    
    // 按搜索关键词筛选
    if (newFilters.searchQuery) {
      const query = newFilters.searchQuery.toLowerCase();
      results = results.filter(dest => 
        dest.title.toLowerCase().includes(query) || 
        dest.description.toLowerCase().includes(query) ||
        dest.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredDestinations(results);
  };

  return (
    <div className="destinations-page">
      <div className="destinations-hero">
        <div className="hero-content">
          <h1 className="hero-title">探索新西兰奇妙之旅</h1>
          <p className="hero-subtitle">发现这个世界尽头的自然天堂，体验令人难忘的文化与冒险</p>
        </div>
      </div>
      
      <div className="destinations-container">
        <DestinationFilter onFilterChange={handleFilterChange} />
        
        <div className="filter-results">
          <h2 className="results-title">
            {filteredDestinations.length > 0 
              ? `为您找到 ${filteredDestinations.length} 个目的地` 
              : '暂无符合条件的目的地'}
          </h2>
          
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => (
              <Link href={`/destinations/${destination.slug}`} className="destination-card" key={index}>
                <div className="destination-image-container">
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.title}
                    className="destination-image"
                  />
                </div>
                <div className="destination-content">
                  <h3 className="destination-title">{destination.title}</h3>
                  
                  <div className="destination-tags">
                    {destination.activityTypes.map((type, i) => (
                      <span key={i} className={`destination-tag ${type}`}>
                        {activityTypeLabels[type as keyof typeof activityTypeLabels]}
                      </span>
                    ))}
                  </div>
                  
                  <p className="destination-description">{destination.description}</p>
                  
                  <div className="destination-meta">
                    <div className="destination-rating">
                      <span className="star-icon">★</span>
                      <span className="rating-text">{destination.rating}</span>
                    </div>
                    <div className="destination-price">
                      ¥{destination.price}
                    </div>
                  </div>
                  
                  <div className="destination-location">
                    <svg className="location-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {destination.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

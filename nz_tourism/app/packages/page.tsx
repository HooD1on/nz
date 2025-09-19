// nz_tourism/app/packages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from '../../types/package';
import '@/styles/pages/packages.css';

// 模拟套餐数据
const allPackages: Package[] = [
  {
    id: '1',
    title: 'North Island Explorer',
    description: 'Discover the beauty of New Zealand\'s North Island, from the vibrant city of Auckland to the cultural capital Wellington.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    price: 2999,
    duration: '8天7晚',
    rating: 4.8,
    reviewCount: 124,
    includes: [
      '奥克兰城市观光',
      '怀托摩萤火虫洞',
      '霍比特人村体验',
      '罗托鲁瓦地热公园',
      '惠灵顿文化之旅',
      '四星级酒店住宿',
      '专业中文导游',
      '景点门票'
    ],
    category: 'nature',
    location: '北岛',
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'South Island Adventure',
    description: 'Experience the stunning landscapes of the South Island, including the adventure capital Queenstown and the garden city Christchurch.',
    imageUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
    price: 3599,
    duration: '10天9晚',
    rating: 4.9,
    reviewCount: 89,
    includes: [
      '皇后镇观光',
      '米尔福德峡湾游船',
      '冰川徒步体验',
      '基督城花园游览',
      '五星级酒店住宿',
      '专业英文导游',
      '所有交通费用',
      '特色餐饮体验'
    ],
    category: 'adventure',
    location: '南岛',
    difficulty: 'Moderate'
  },
  {
    id: '3',
    title: 'Maori Culture Experience',
    description: 'Immerse yourself in Maori culture with traditional performances, geothermal wonders, and authentic cultural experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
    price: 1999,
    duration: '5天4晚',
    rating: 4.7,
    reviewCount: 156,
    includes: [
      '毛利文化村体验',
      '传统汉吉晚餐',
      '地热奇观游览',
      '毛利工艺品制作',
      '精品酒店住宿',
      '文化导游讲解',
      '往返交通',
      '文化纪念品'
    ],
    category: 'culture',
    location: '罗托鲁瓦',
    difficulty: 'Easy'
  },
  {
    id: 'south-island-nature',
    title: '南岛自然探索之旅',
    description: '8天7晚深度游览新西兰南岛，体验最纯净的自然风光。',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    price: 2999,
    duration: '8天7晚',
    rating: 4.8,
    reviewCount: 124,
    includes: [
      '皇后镇观光',
      '米尔福德峡湾游船',
      '冰川徒步体验',
      '四星级酒店住宿',
      '专业中文导游'
    ],
    category: 'nature',
    location: '南岛',
    difficulty: 'Moderate'
  },
  {
    id: 'north-island-culture',
    title: '北岛文化休闲游',
    description: '6天5晚探索北岛文化与地热奇观，体验毛利文化魅力。',
    imageUrl: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&h=600&fit=crop',
    price: 2499,
    duration: '6天5晚',
    rating: 4.6,
    reviewCount: 98,
    includes: [
      '罗托鲁瓦地热公园',
      '毛利文化村体验',
      '霍比特人村游览',
      '怀托摩萤火虫洞',
      '奥克兰城市观光'
    ],
    category: 'culture',
    location: '北岛',
    difficulty: 'Easy'
  },
  {
    id: 'all-around-nz',
    title: '环岛精华体验',
    description: '12天11晚环岛游，囊括新西兰最精彩的景点和体验。',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&h=600&fit=crop',
    price: 4299,
    duration: '12天11晚',
    rating: 4.9,
    reviewCount: 67,
    includes: [
      '南北岛精华景点',
      '特色美食品鉴',
      '高端酒店住宿',
      '直升机观光',
      '私人定制行程'
    ],
    category: 'adventure',
    location: '全岛',
    difficulty: 'Challenging'
  }
];

// 筛选选项
const categories = [
  { id: 'all', name: '全部分类' },
  { id: 'nature', name: '自然风光' },
  { id: 'culture', name: '文化体验' },
  { id: 'adventure', name: '探险活动' },
  { id: 'city', name: '城市观光' }
];

const priceRanges = [
  { id: 'all', name: '全部价格', min: 0, max: Infinity },
  { id: 'low', name: '2000元以下', min: 0, max: 2000 },
  { id: 'mid', name: '2000-3500元', min: 2000, max: 3500 },
  { id: 'high', name: '3500元以上', min: 3500, max: Infinity }
];

const durations = [
  { id: 'all', name: '全部时长' },
  { id: 'short', name: '5天以下' },
  { id: 'medium', name: '5-8天' },
  { id: 'long', name: '8天以上' }
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(allPackages);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(allPackages);
  const [loading, setLoading] = useState(false);
  
  // 筛选状态
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'duration'>('price');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 应用筛选
  useEffect(() => {
    let filtered = [...packages];

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }

    // 价格筛选
    if (selectedPriceRange !== 'all') {
      const priceRange = priceRanges.find(range => range.id === selectedPriceRange);
      if (priceRange) {
        filtered = filtered.filter(pkg => 
          pkg.price >= priceRange.min && pkg.price <= priceRange.max
        );
      }
    }

    // 时长筛选
    if (selectedDuration !== 'all') {
      filtered = filtered.filter(pkg => {
        const days = parseInt(pkg.duration);
        switch (selectedDuration) {
          case 'short': return days < 5;
          case 'medium': return days >= 5 && days <= 8;
          case 'long': return days > 8;
          default: return true;
        }
      });
    }

    // 关键词搜索
    if (searchKeyword) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        pkg.location?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, selectedCategory, selectedPriceRange, selectedDuration, sortBy, searchKeyword]);

  // 重置筛选
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedDuration('all');
    setSearchKeyword('');
    setSortBy('price');
  };

  return (
    <div className="packages-page">
      {/* 页面头部 */}
      <div className="packages-header">
        <div className="container">
          <h1>新西兰旅游套餐</h1>
          <p>精心策划的新西兰旅行体验，从自然风光到文化探索，满足您的每一个旅行梦想</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* 搜索和筛选区域 */}
        <div className="filters-section">
          <div className="filters-container">
            {/* 搜索框 */}
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="搜索套餐..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="search-input"
                />
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 筛选选项 */}
            <div className="filters-grid">
              {/* 分类筛选 */}
              <div className="filter-group">
                <label>分类</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 价格筛选 */}
              <div className="filter-group">
                <label>价格</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="filter-select"
                >
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 时长筛选 */}
              <div className="filter-group">
                <label>时长</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="filter-select"
                >
                  {durations.map(duration => (
                    <option key={duration.id} value={duration.id}>
                      {duration.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 排序 */}
              <div className="filter-group">
                <label>排序</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'duration')}
                  className="filter-select"
                >
                  <option value="price">价格从低到高</option>
                  <option value="rating">评分从高到低</option>
                  <option value="duration">时长从短到长</option>
                </select>
              </div>
            </div>

            {/* 重置按钮 */}
            <div className="filters-footer">
              <button onClick={resetFilters} className="reset-button">
                重置筛选
              </button>
              <div className="results-count">
                找到 {filteredPackages.length} 个套餐
              </div>
            </div>
          </div>
        </div>

        {/* 套餐列表 */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">🔍</div>
            <h3>未找到相关套餐</h3>
            <p>请尝试调整筛选条件或搜索关键词</p>
            <button onClick={resetFilters} className="empty-reset-button">
              重置筛选
            </button>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    width={320}
                    height={192}
                    priority={false}
                  />
                  <div className="package-duration-badge">
                    {pkg.duration}
                  </div>
                </div>
                
                <div className="package-content">
                  <div className="package-header">
                    <Link href={`/packages/${pkg.id}`} className="package-title">
                      {pkg.title}
                    </Link>
                    <div className="package-rating">
                      <svg className="rating-star" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="rating-text">{pkg.rating}</span>
                    </div>
                  </div>
                  
                  <p className="package-description">
                    {pkg.description}
                  </p>
                  
                  <div className="package-includes">
                    <h4>套餐包含:</h4>
                    <ul>
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          <svg className="include-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                      {pkg.includes.length > 3 && (
                        <li className="more-items">
                          +{pkg.includes.length - 3} 更多项目
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="package-footer">
                    <div className="package-price">
                      ¥{pkg.price.toLocaleString()}
                      <span className="price-suffix">起</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`} className="package-button">
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

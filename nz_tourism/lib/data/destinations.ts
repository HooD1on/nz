export interface Destination {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  highlights: string[];
  bestTimeToVisit: string;
  activities: string[];
  priceRange: string;
  rating: number;
  reviews: number;
}

export const destinations: Destination[] = [
  {
    id: '1',
    title: '皇后镇',
    description: '皇后镇是新西兰最著名的旅游胜地之一，以其壮丽的自然风光和丰富的户外活动而闻名。这里是极限运动的发源地，也是美食和美酒的天堂。',
    location: '南岛',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
    ],
    highlights: [
      '极限运动之都',
      '壮丽的湖光山色',
      '世界级的美食和美酒',
      '四季皆宜的旅游胜地'
    ],
    bestTimeToVisit: '全年皆宜，夏季（12月-2月）最佳',
    activities: [
      '蹦极跳',
      '喷射快艇',
      '滑雪',
      '徒步旅行',
      '品酒之旅'
    ],
    priceRange: '$$$',
    rating: 4.8,
    reviews: 1250
  },
  {
    id: '2',
    title: '奥克兰',
    description: '奥克兰是新西兰最大的城市，被称为"帆船之都"。这里融合了都市的繁华与自然的宁静，是探索新西兰的理想起点。',
    location: '北岛',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
    ],
    highlights: [
      '帆船之都',
      '多元文化',
      '美食天堂',
      '购物胜地'
    ],
    bestTimeToVisit: '春季（9月-11月）和秋季（3月-5月）',
    activities: [
      '城市观光',
      '购物',
      '美食之旅',
      '帆船体验',
      '博物馆参观'
    ],
    priceRange: '$$',
    rating: 4.5,
    reviews: 980
  },
  {
    id: '3',
    title: '罗托鲁瓦',
    description: '罗托鲁瓦是新西兰的地热之都，以其独特的地热景观和毛利文化而闻名。这里是体验新西兰原住民文化和自然奇观的绝佳地点。',
    location: '北岛',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
    ],
    highlights: [
      '地热奇观',
      '毛利文化',
      '温泉体验',
      '自然美景'
    ],
    bestTimeToVisit: '全年皆宜，冬季（6月-8月）温泉体验最佳',
    activities: [
      '地热公园游览',
      '毛利文化表演',
      '温泉体验',
      '徒步旅行',
      '山地自行车'
    ],
    priceRange: '$$',
    rating: 4.6,
    reviews: 850
  }
]; 
import { NextResponse } from 'next/server';

// 使用真实的网络图片资源
const destinations = [
  {
    id: '1',
    title: '皇后镇',
    description: '新西兰最著名的旅游胜地，以其壮丽的自然风光和丰富的户外活动而闻名。这里四季分明，每个季节都有其独特的魅力。',
    location: '新西兰南岛',
    images: [
      'https://images.unsplash.com/photo-1485388276992-0ce5ce2d6981?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',  // 皇后镇全景
      'https://images.unsplash.com/photo-1591105327764-2f0c7d45b740?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',  // 瓦卡蒂普湖
      'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'   // remarkables山脉
    ],
    highlights: [
      '壮丽的湖光山色',
      '世界级的滑雪场',
      '刺激的户外活动',
      '美食和美酒'
    ],
    bestTimeToVisit: '全年皆宜，冬季适合滑雪，夏季适合户外活动',
    activities: [
      '滑雪',
      '蹦极',
      '喷射快艇',
      '徒步旅行',
      '品酒'
    ],
    priceRange: '$$$',
    rating: 4.8,
    reviews: 1250
  },
  {
    id: '2',
    title: '奥克兰',
    description: '新西兰最大的城市，拥有丰富的文化活动和美食体验。城市周边有众多美丽的海滩和岛屿可供探索。',
    location: '新西兰北岛',
    images: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',  // 奥克兰天际线
      'https://images.unsplash.com/photo-1581269876266-f95d5e31b2ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2067&q=80',  // 怀赫科岛
      'https://images.unsplash.com/photo-1595113230152-88d716d3c2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80'   // 天空塔
    ],
    highlights: [
      '天空塔观光',
      '怀赫科岛一日游',
      '海港美食之旅',
      '火山徒步探索'
    ],
    bestTimeToVisit: '12月至2月（夏季）天气最佳',
    activities: [
      '天空塔蹦极',
      '帆船体验',
      '火山徒步',
      '美食之旅',
      '岛屿游览'
    ],
    priceRange: '$$',
    rating: 4.5,
    reviews: 980
  },
  {
    id: '3',
    title: '罗托鲁瓦',
    description: '以地热活动和毛利文化闻名的旅游胜地。这里有喷泉、温泉和泥浆池，以及丰富的毛利文化体验。',
    location: '新西兰北岛',
    images: [
      'https://images.unsplash.com/photo-1601491169882-526fd8d3aba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',  // 地热公园
      'https://images.unsplash.com/photo-1602550033650-8d475d297eed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',  // 毛利文化村
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'   // 红木森林
    ],
    highlights: [
      '地热奇观',
      '毛利文化体验',
      '温泉浴场',
      '红木森林'
    ],
    bestTimeToVisit: '夏季（12月至2月）和冬季（6月至8月）都适合',
    activities: [
      '地热公园游览',
      '毛利文化表演',
      '温泉浴',
      '红木森林漫步',
      '泥浆浴体验'
    ],
    priceRange: '$$',
    rating: 4.6,
    reviews: 850
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const destination = destinations.find(d => d.id === id);
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    return NextResponse.json(destination);
  }

  return NextResponse.json(destinations);
} 
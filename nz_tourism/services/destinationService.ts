// 类型定义
export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  weather: string;
  transportation: string;
  food: string;
  accommodation: string;
  customs: string;
  language: string;
  currency: string;
  timeZone: string;
  images: {
    url: string;
    alt: string;
  }[];
  reviews: ReviewItem[];
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating: number;
  date: string;
  images?: string[];
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

// 模拟数据
const destinations: Record<string, Destination> = {
  'queenstown': {
    id: 'queenstown',
    title: '皇后镇',
    subtitle: '新西兰的冒险之都',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    location: '新西兰南岛',
    rating: 4.8,
    reviewCount: 1250,
    description: '皇后镇是新西兰最受欢迎的旅游目的地之一，以其壮丽的自然风光和丰富的户外活动而闻名。这里四季分明，每个季节都有独特的魅力。从滑雪到蹦极，从葡萄酒品鉴到湖上巡游，皇后镇为游客提供了无尽的探索机会。',
    highlights: [
      '世界级的滑雪场和户外活动',
      '壮丽的瓦卡蒂普湖和南阿尔卑斯山',
      '著名的蹦极和喷射快艇',
      '优质的葡萄酒产区',
      '丰富的餐饮和购物选择'
    ],
    bestTimeToVisit: '全年皆宜，冬季（6-8月）适合滑雪，夏季（12-2月）适合户外活动',
    weather: '四季分明，夏季温暖（15-25°C），冬季凉爽（0-10°C）',
    transportation: '可以从奥克兰或基督城乘坐国内航班直达皇后镇机场。市内可以选择租车、巴士或观光团游览。许多景点也提供接送服务。',
    food: '皇后镇有丰富的餐饮选择，从高档餐厅到特色小吃应有尽有。必尝美食包括fergburger汉堡、当地的pinot noir葡萄酒、新西兰羊肉和海鲜。',
    accommodation: '皇后镇住宿选择丰富，从豪华湖畔酒店到经济型旅馆和背包客栈。建议提前预订，特别是在旅游旺季（夏季和冬季）。',
    customs: '新西兰人友好开放，注重环保。给小费不是必须的。进入私人土地前需获得许可，尊重毛利文化传统。',
    language: '英语',
    currency: '新西兰元 (NZD)',
    timeZone: 'UTC+12 (夏令时 UTC+13)',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        alt: '皇后镇全景'
      },
      {
        url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
        alt: '瓦卡蒂普湖'
      },
      {
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
        alt: '滑雪场'
      },
      {
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
        alt: '蹦极'
      },
      {
        url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=800&q=80',
        alt: '葡萄酒庄园'
      }
    ],
    reviews: [
      {
        id: '1',
        userName: '李明',
        userAvatar: '/images/avatars/user1.jpg',
        content: '皇后镇是我去过的最美丽的地方之一！风景如画，尤其是瓦卡蒂普湖的日出和日落。我们尝试了蹦极和喷射快艇，非常刺激！住宿和餐饮价格略高，但物有所值。强烈推荐至少停留3-4天。',
        rating: 5,
        date: '2023-05-15',
        images: [
          '/images/reviews/queenstown1.jpg',
          '/images/reviews/queenstown2.jpg'
        ]
      },
      {
        id: '2',
        userName: '王芳',
        userAvatar: '/images/avatars/user2.jpg',
        content: '作为一个葡萄酒爱好者，我非常喜欢皇后镇附近的酒庄之旅。Gibbston Valley的葡萄酒品质一流，风景也非常优美。市区的餐厅提供很多搭配当地葡萄酒的美食。',
        rating: 4,
        date: '2023-04-20'
      },
      {
        id: '3',
        userName: '张伟',
        userAvatar: '/images/avatars/user3.jpg',
        content: '冬季来皇后镇滑雪是绝佳选择！Coronet Peak和The Remarkables滑雪场设施完善，适合各个级别的滑雪者。晚上市区的夜生活也很丰富。唯一的缺点是旺季时价格较高。',
        rating: 5,
        date: '2023-07-10',
        images: [
          '/images/reviews/queenstown3.jpg'
        ]
      }
    ]
  },
  'auckland': {
    id: 'auckland',
    title: '奥克兰',
    subtitle: '千帆之都',
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    location: '新西兰北岛',
    rating: 4.6,
    reviewCount: 980,
    description: '奥克兰是新西兰最大的城市，以其独特的城市风光和丰富的文化活动而闻名。这座城市坐落在火山群和两个海港之间，提供了独特的城市与自然融合的体验。',
    highlights: [
      '天空塔和城市全景',
      '怀赫科岛葡萄酒之旅',
      '奥克兰博物馆和艺术馆',
      '皮哈海滩和西海岸',
      '丰富的购物和美食体验'
    ],
    bestTimeToVisit: '全年皆宜，夏季（12-2月）气候最宜人',
    weather: '温和的海洋性气候，夏季温暖（20-25°C），冬季凉爽（10-15°C）',
    transportation: '奥克兰国际机场是新西兰最大的国际机场，有来自世界各地的航班。市内交通便利，有公交、火车和渡轮。租车是探索周边地区的好选择。',
    food: '奥克兰是一个多元文化城市，提供各种国际美食。海鲜、牛排和当地葡萄酒是必尝的。Ponsonby和Wynyard Quarter有很多高质量的餐厅。',
    accommodation: '从五星级豪华酒店到经济型旅舍，奥克兰提供各种住宿选择。中央商务区和Viaduct Harbour地区住宿便利但价格较高。',
    customs: '奥克兰是多元文化城市，尊重不同文化习俗。新西兰重视环保，请妥善处理垃圾。参观毛利文化场所时请遵循当地指引。',
    language: '英语',
    currency: '新西兰元 (NZD)',
    timeZone: 'UTC+12 (夏令时 UTC+13)',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
        alt: '奥克兰城市全景'
      },
      {
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
        alt: '天空塔'
      },
      {
        url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
        alt: '怀赫科岛'
      },
      {
        url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
        alt: '皮哈海滩'
      }
    ],
    reviews: [
      {
        id: '1',
        userName: '陈静',
        userAvatar: '/images/avatars/user4.jpg',
        content: '作为一个城市爱好者，我非常喜欢奥克兰的多元文化氛围。从天空塔可以俯瞰整个城市，怀赫科岛的一日游也非常值得。美食选择很多，特别是海鲜非常新鲜。',
        rating: 5,
        date: '2023-01-15'
      },
      {
        id: '2',
        userName: '刘强',
        userAvatar: '/images/avatars/user5.jpg',
        content: '奥克兰是新西兰之旅的良好起点。城市不大但设施完善，公共交通便利。西海岸的黑沙滩值得一去，天空塔的蹦极也很刺激。入住Viaduct区域便于游览。',
        rating: 4,
        date: '2023-02-28',
        images: [
          '/images/reviews/auckland1.jpg',
          '/images/reviews/auckland2.jpg'
        ]
      },
      {
        id: '3',
        userName: '赵薇',
        userAvatar: '/images/avatars/user6.jpg',
        content: '带孩子来奥克兰很适合，海洋馆和动物园都很有趣。交通方便，人们友善。唯一遗憾的是下雨较多，户外活动受限。餐厅价格比预期的高。',
        rating: 4,
        date: '2023-04-05'
      }
    ]
  }
};

const relatedPackages: Record<string, Package[]> = {
  'queenstown': [
    {
      id: 'queenstown-adventure',
      title: '皇后镇冒险之旅',
      description: '体验皇后镇最刺激的户外活动，包括蹦极、喷射快艇和滑雪',
      price: 2999,
      duration: '5天4晚',
      imageUrl: '/images/packages/queenstown-adventure.jpg',
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: 'queenstown-relax',
      title: '皇后镇休闲度假',
      description: '享受皇后镇的湖光山色，体验葡萄酒品鉴和温泉',
      price: 2599,
      duration: '4天3晚',
      imageUrl: '/images/packages/queenstown-relax.jpg',
      rating: 4.7,
      reviewCount: 98
    }
  ],
  'auckland': [
    {
      id: 'auckland-city',
      title: '奥克兰城市探索',
      description: '探索奥克兰的城市魅力，包括天空塔、博物馆和购物',
      price: 1999,
      duration: '3天2晚',
      imageUrl: '/images/packages/auckland-city.jpg',
      rating: 4.6,
      reviewCount: 87
    },
    {
      id: 'auckland-island',
      title: '奥克兰岛屿之旅',
      description: '探索怀赫科岛和朗伊托托岛，体验葡萄酒和自然风光',
      price: 2299,
      duration: '4天3晚',
      imageUrl: '/images/packages/auckland-island.jpg',
      rating: 4.8,
      reviewCount: 65
    }
  ]
};

// 数据服务方法
export const destinationService = {
  // 获取所有目的地列表
  getAllDestinations: async (): Promise<Destination[]> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return Object.values(destinations);
  },

  // 获取单个目的地详情
  getDestinationById: async (id: string): Promise<Destination | null> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return destinations[id] || null;
  },

  // 获取相关套餐
  getRelatedPackages: async (destinationId: string): Promise<Package[]> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return relatedPackages[destinationId] || [];
  }
}; 
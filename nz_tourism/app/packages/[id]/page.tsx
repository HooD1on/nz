// nz_tourism/app/packages/[id]/page.tsx
import { notFound } from 'next/navigation';
import { PackageDetailsPage } from '../../../components/package/PackageDetailsPage';

// 模拟套餐数据 - 实际项目中应该从API获取
const packages = {
  '1': {
    id: '1',
    title: 'North Island Explorer',
    subtitle: 'Auckland to Wellington',
    description: 'Discover the beauty of New Zealand\'s North Island, from the vibrant city of Auckland to the cultural capital Wellington.',
    imageUrl: '/images/north-island.jpg',
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
    highlights: [
      '体验世界著名的怀托摩萤火虫洞奇观',
      '探访《指环王》霍比特人村拍摄地',
      '感受罗托鲁瓦独特的地热文化',
      '品尝新西兰特色美食'
    ],
    itinerary: [
      {
        day: 1,
        title: '抵达奥克兰',
        activities: ['机场接机', '奥克兰市区观光', '天空塔观景', '酒店入住']
      },
      {
        day: 2,
        title: '奥克兰 - 怀托摩',
        activities: ['前往怀托摩', '萤火虫洞探险', '当地农场体验']
      },
      {
        day: 3,
        title: '怀托摩 - 罗托鲁瓦',
        activities: ['霍比特人村游览', '地热公园参观', '毛利文化表演']
      }
    ]
  },
  '2': {
    id: '2',
    title: 'South Island Adventure',
    subtitle: 'Queenstown to Christchurch',
    description: 'Experience the stunning landscapes of the South Island, including the adventure capital Queenstown and the garden city Christchurch.',
    imageUrl: '/images/south-island.jpg',
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
    highlights: [
      '乘坐直升机俯瞰南阿尔卑斯山',
      '体验世界遗产米尔福德峡湾',
      '参与刺激的极限运动项目',
      '欣赏纯净的自然风光'
    ],
    itinerary: [
      {
        day: 1,
        title: '抵达皇后镇',
        activities: ['机场接机', '皇后镇湖边漫步', '缆车观景', '酒店入住']
      },
      {
        day: 2,
        title: '米尔福德峡湾一日游',
        activities: ['早餐后出发', '峡湾游船', '瀑布观赏', '野生动物观察']
      },
      {
        day: 3,
        title: '极限运动日',
        activities: ['蹦极跳', '滑翔伞', '喷射艇', '温泉放松']
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Maori Culture Experience',
    subtitle: 'Rotorua Cultural Tour',
    description: 'Immerse yourself in Maori culture with traditional performances, geothermal wonders, and authentic cultural experiences.',
    imageUrl: '/images/maori-culture.jpg',
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
    highlights: [
      '深度体验原住民毛利文化',
      '参与传统毛利仪式',
      '品尝地道汉吉美食',
      '学习毛利语言和手工艺'
    ],
    itinerary: [
      {
        day: 1,
        title: '抵达罗托鲁瓦',
        activities: ['机场接机', '毛利文化村参观', '传统欢迎仪式', '酒店入住']
      },
      {
        day: 2,
        title: '地热奇观之旅',
        activities: ['地热公园游览', '间歇泉观察', '温泉体验', '汉吉晚餐']
      },
      {
        day: 3,
        title: '文化深度体验',
        activities: ['毛利手工艺学习', '传统舞蹈表演', '语言文化交流']
      }
    ]
  },
  'south-island-nature': {
    id: 'south-island-nature',
    title: '南岛自然探索之旅',
    subtitle: '8天7晚深度游览新西兰南岛',
    description: '8天7晚深度游览新西兰南岛，体验最纯净的自然风光。',
    imageUrl: '/images/packages/south-island-nature.jpg',
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
    highlights: [
      '体验世界遗产米尔福德峡湾',
      '近距离接触弗朗茨·约瑟夫冰川',
      '探索南阿尔卑斯山脉',
      '享受纯净的自然美景'
    ],
    itinerary: []
  }
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const awaitedParams = await params;
  const packageData = packages[awaitedParams.id as keyof typeof packages];

  if (!packageData) {
    notFound();
  }

  return <PackageDetailsPage packageData={packageData} />;
}
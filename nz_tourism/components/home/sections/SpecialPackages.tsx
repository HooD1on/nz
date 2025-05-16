import SectionTitle from '../common/SectionTitle';
import PackageCard from '../ui/PackageCard';

const specialPackages = [
  {
    title: "南岛自然探索之旅",
    description: "8天7晚深度游览新西兰南岛，体验最纯净的自然风光。",
    imageUrl: "/images/packages/south-island-nature.jpg",
    price: 2999,
    duration: "8天7晚",
    includes: [
      "皇后镇观光",
      "米尔福德峡湾游船",
      "冰川徒步体验",
      "四星级酒店住宿",
      "专业中文导游"
    ],
    slug: "south-island-nature",
    featured: true
  },
  {
    title: "北岛文化休闲游",
    description: "6天5晚探索北岛文化与地热奇观，体验毛利文化魅力。",
    imageUrl: "/images/packages/north-island-culture.jpg",
    price: 2499,
    duration: "6天5晚",
    includes: [
      "罗托鲁瓦地热公园",
      "毛利文化村体验",
      "霍比特人村游览",
      "怀托摩萤火虫洞",
      "奥克兰城市观光"
    ],
    slug: "north-island-culture"
  },
  {
    title: "环岛精华体验",
    description: "12天11晚环岛游，囊括新西兰最精彩的景点和体验。",
    imageUrl: "/images/packages/all-around-nz.jpg",
    price: 4299,
    duration: "12天11晚",
    includes: [
      "南北岛精华景点",
      "特色美食品鉴",
      "高端酒店住宿",
      "直升机观光",
      "私人定制行程"
    ],
    slug: "all-around-nz"
  }
];

const SpecialPackages = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="精选旅游套餐"
          subtitle="为您精心挑选的新西兰最佳旅行体验，让您的旅程更加完美"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialPackages.map((pkg) => (
            <PackageCard
              key={pkg.slug}
              {...pkg}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialPackages; 
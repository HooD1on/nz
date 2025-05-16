import SectionTitle from '../common/SectionTitle';
import FeatureCard from '../ui/FeatureCard';

const features = [
  {
    title: "专业定制行程",
    description: "根据您的兴趣和需求，为您量身打造完美的新西兰旅行计划。",
    icon: (
      <svg className="feature-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    title: "当地向导服务",
    description: "专业的本地向导带您深入探索新西兰的自然与文化，体验最地道的旅行。",
    icon: (
      <svg className="feature-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: "优质住宿保障",
    description: "精选高品质酒店和特色住宿，确保您在旅途中享受舒适的休息时光。",
    icon: (
      <svg className="feature-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "24/7 在线支持",
    description: "全天候客服团队为您提供及时的帮助和支持，解决旅行中的任何问题。",
    icon: (
      <svg className="feature-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <SectionTitle 
          title="我们的特色服务"
          subtitle="为什么选择我们？专业的团队为您提供最优质的旅行体验"
        />
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 
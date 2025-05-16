'use client';

import { useState } from 'react';
import Link from 'next/link';
import FAQItem from '../ui/FAQItem';

const faqItems = [
  {
    question: "新西兰最佳旅游季节是什么时候？",
    answer: "新西兰最佳旅游季节是夏季（12月至2月），此时天气温暖，适合各种户外活动。但春季（9月至11月）和秋季（3月至5月）游客较少，风景同样优美，也是不错的选择。"
  },
  {
    question: "前往新西兰旅游需要办理什么签证？",
    answer: "中国公民前往新西兰旅游需要办理访问签证。此外，您还需要申请电子旅行授权(ETA)。建议提前至少一个月申请，以确保有足够的处理时间。"
  },
  {
    question: "新西兰有哪些必去的景点？",
    answer: "新西兰必去景点包括：米尔福德峡湾、皇后镇、罗托鲁瓦地热区、霍比特人村（马塔马塔）、福克斯冰川和弗朗兹约瑟夫冰川、陶波湖区以及首都惠灵顿和最大城市奥克兰。"
  },
  {
    question: "在新西兰旅行需要租车吗？",
    answer: "租车是探索新西兰最便捷的方式，尤其是想要前往偏远地区。新西兰道路条件良好，但要注意他们是靠左行驶。如果不习惯驾驶，主要城市和热门旅游目的地之间也有完善的巴士和观光团服务。"
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="section-title">常见问题</h2>
        <ul className="faq-list">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </ul>
        <div className="faq-see-more">
          <Link href="/faq" className="faq-see-more-link">
            查看更多常见问题
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 
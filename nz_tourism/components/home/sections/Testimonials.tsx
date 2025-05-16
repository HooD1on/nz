import React from 'react';
import Link from 'next/link';
import TestimonialCard from '../ui/TestimonialCard';

const testimonials = [
  {
    id: 1,
    content: "这是我体验过的最完美的旅行！新西兰的自然风光令人叹为观止，VacaSky的服务更是让整个旅程毫无后顾之忧。专业的导游不仅带我们领略了新西兰的美景，还分享了许多当地文化和历史知识。",
    rating: 5,
    author: {
      name: "张女士",
      title: "艺术家",
      location: "上海",
      avatar: "/images/testimonials/avatar-1.jpg"
    }
  },
  {
    id: 2,
    content: "三口之家的完美假期！孩子特别喜欢霍比特人村和黑水漂流，这些独特的体验让他对新西兰充满了美好回忆。感谢VacaSky为我们精心安排的亲子友好行程，下次旅行还会选择你们。",
    rating: 5,
    author: {
      name: "李先生",
      title: "工程师",
      location: "北京",
      avatar: "/images/testimonials/avatar-2.jpg"
    }
  },
  {
    id: 3,
    content: "作为一个摄影爱好者，新西兰是天堂！VacaSky的团队非常理解我的需求，为我安排了最佳的拍摄时间和地点。从米尔福德峡湾到库克山，每一站都让我的相机忙个不停。非常专业的服务！",
    rating: 4,
    author: {
      name: "王先生",
      title: "摄影师",
      location: "广州",
      avatar: "/images/testimonials/avatar-3.jpg"
    }
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="section-title">客户评价</h2>
        <p className="section-subtitle">听听我们的客户如何评价他们的新西兰之旅</p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id}
              content={testimonial.content}
              rating={testimonial.rating}
              author={testimonial.author}
            />
          ))}
        </div>
        
        <div className="testimonials-see-more">
          <Link href="/testimonials" className="btn">
            查看更多评价
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
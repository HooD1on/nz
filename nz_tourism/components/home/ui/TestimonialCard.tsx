import React from 'react';
import Image from 'next/image';

interface TestimonialAuthor {
  name: string;
  title: string;
  location: string;
  avatar: string;
}

interface TestimonialCardProps {
  content: string;
  rating: number;
  author: TestimonialAuthor;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  rating,
  author
}) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="rating-star">
              {i < rating ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>
      
      <blockquote className="testimonial-content">
        <p>{content}</p>
      </blockquote>
      
      <div className="testimonial-author">
        <div className="author-avatar">
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
          />
        </div>
        <div className="author-info">
          <div className="author-name">{author.name}</div>
          <div className="author-title">{author.title}</div>
          <div className="author-location">{author.location}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 
import React from 'react';
import Image from 'next/image';

interface Author {
  name: string;
  title: string;
  location: string;
  avatar: string;
}

interface TestimonialCardProps {
  content: string;
  rating: number;
  author: Author;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  rating,
  author
}) => {
  return (
    <div className="card card--testimonial">
      <div className="card__body">
        <div className="card__rating">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${i < rating ? 'filled' : ''}`}
            >
              ★
            </span>
          ))}
        </div>
        
        <p className="card__content">"{content}"</p>
        
        <div className="card__author">
          <div className="author-avatar">
            <Image
              src={author.avatar}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div className="author-info">
            <div className="author-name">{author.name}</div>
            <div className="author-details">{author.title} · {author.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
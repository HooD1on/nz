'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating: number;
  date: string;
  images?: string[];
}

interface ReviewSectionProps {
  destinationId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  destinationId,
  reviews,
  averageRating,
  totalReviews
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // 按评分分布
  const ratingDistribution = {
    5: Math.round((reviews.filter(r => r.rating === 5).length / totalReviews) * 100),
    4: Math.round((reviews.filter(r => r.rating === 4).length / totalReviews) * 100),
    3: Math.round((reviews.filter(r => r.rating === 3).length / totalReviews) * 100),
    2: Math.round((reviews.filter(r => r.rating === 2).length / totalReviews) * 100),
    1: Math.round((reviews.filter(r => r.rating === 1).length / totalReviews) * 100),
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该是调用API提交评论
    console.log(`Submitting review: ${newReview} with rating: ${newRating}`);
    // 提交后重置表单
    setNewReview('');
    setNewRating(5);
    // 显示成功消息
    alert('评论提交成功，等待审核后显示');
  };

  return (
    <div className="review-section">
      <h2 className="section-title">游客评价</h2>
      
      <div className="review-overview">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`star-icon ${i < Math.floor(averageRating) ? 'filled' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="total-reviews">({totalReviews} 条评价)</span>
          </div>
          
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="rating-bar-item">
                <div className="rating-label">{rating} 星</div>
                <div className="rating-bar">
                  <div
                    className="rating-bar-fill"
                    style={{ width: `${ratingDistribution[rating as keyof typeof ratingDistribution]}%` }}
                  ></div>
                </div>
                <div className="rating-percentage">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="review-list">
        {displayedReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="reviewer-details">
                  <div className="reviewer-name">{review.userName}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star-icon ${i < review.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="review-content">
              <p>{review.content}</p>
            </div>
            
            {review.images && review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((img, index) => (
                  <div key={index} className="review-image">
                    <Image
                      src={img}
                      alt={`评价配图 ${index + 1}`}
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {reviews.length > 3 && (
        <div className="show-more">
          <button
            className="show-more-button"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? '收起评价' : `查看全部 ${totalReviews} 条评价`}
          </button>
        </div>
      )}
      
      <div className="write-review">
        <h3 className="review-form-title">分享您的体验</h3>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <div className="rating-select">
            <span className="rating-label">您的评分：</span>
            <div className="rating-stars-input">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className={`star-input ${rating <= (hoveredRating || newRating) ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setNewRating(rating)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="review-textarea">
            <textarea
              placeholder="请分享您的旅行体验和建议..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-review-button">
            提交评价
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection; 
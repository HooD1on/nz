// nz_tourism/components/destination/ReviewSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// 确保API基础URL末尾没有斜杠
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5152';

// 添加目的地ID映射 - 确保与后端完全一致
const destinationGuidMap: {[key: string]: string} = {
  'queenstown': 'f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c',
  'auckland': 'a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2',
  'rotorua': 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6',
  'milford-sound': 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7',
  'hobbiton': 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8'
};

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating: number;
  date: string;
  images?: string[];
  isLoggedInUser: boolean;
}

interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
}

interface ReviewSectionProps {
  destinationId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  destinationId,
  reviews: initialReviews = [],
  averageRating: initialAverageRating = 0,
  totalReviews: initialTotalReviews = 0
}) => {
  const { data: session } = useSession();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [statistics, setStatistics] = useState<ReviewStatistics>({
    averageRating: initialAverageRating,
    totalReviews: initialTotalReviews,
    ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
  });
  const [loading, setLoading] = useState(true);

  // 记录传入的参数以便调试
  useEffect(() => {
    console.log('ReviewSection 初始化参数:', {
      destinationId,
      initialReviews,
      initialAverageRating,
      initialTotalReviews
    });
  }, [destinationId, initialReviews, initialAverageRating, initialTotalReviews]);

  // 获取评论和统计数据
  const fetchReviewData = async () => {
    setLoading(true);
    try {
      console.log('原始destinationId:', destinationId, 'type:', typeof destinationId);
      
      // 转换destinationId - 字符串ID映射到GUID
      let effectiveDestinationId = destinationId;
      if (typeof destinationId === 'string' && destinationGuidMap[destinationId]) {
        effectiveDestinationId = destinationGuidMap[destinationId];
        console.log(`目的地ID "${destinationId}" 已映射到GUID: ${effectiveDestinationId}`);
      }
      
      // 使用映射后的ID构建URL
      const reviewsUrl = `${API_BASE_URL}/api/reviews/destination/${effectiveDestinationId}`;
      console.log('评论请求URL:', reviewsUrl);
      
      // 增强错误处理的请求
      const reviewsResponse = await fetch(reviewsUrl);
      if (!reviewsResponse.ok) {
        console.error('评论请求失败状态:', reviewsResponse.status, reviewsResponse.statusText);
        
        // 尝试读取详细错误信息
        try {
          const errorText = await reviewsResponse.text();
          console.error('错误响应内容:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            console.error('解析后的错误信息:', errorData);
          } catch (e) {
            console.error('错误响应不是有效的JSON格式');
          }
        } catch (e) {
          console.error('无法读取错误响应内容');
        }
        
        throw new Error(`评论数据获取失败: ${reviewsResponse.status}`);
      }
      
      // 处理成功响应
      const reviewsData = await reviewsResponse.json();
      console.log('获取到的评论数据:', reviewsData);
      setReviews(reviewsData);

      // 同样处理统计数据请求
      const statsUrl = `${API_BASE_URL}/api/reviews/destination/${effectiveDestinationId}/statistics`;
      console.log('统计请求URL:', statsUrl);
      
      const statsResponse = await fetch(statsUrl);
      if (!statsResponse.ok) {
        console.error('统计请求失败状态:', statsResponse.status, statsResponse.statusText);
        throw new Error(`评论统计获取失败: ${statsResponse.status}`);
      }
      
      const statsData = await statsResponse.json();
      console.log('获取到的统计数据:', statsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('获取评论数据失败:', error);
      setError('无法加载评论数据，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (destinationId) {
      fetchReviewData();
    } else {
      console.error('无效的destinationId:', destinationId);
      setError('无法加载评论，目的地ID无效');
      setLoading(false);
    }
  }, [destinationId]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // 提交评论 - 修复版
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    if (!newReview) {
      setError('请输入评论内容');
      return;
    }

    if (!session && !guestName) {
      setError('请输入您的名称');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 转换destinationId - 字符串ID映射到GUID
      let effectiveDestinationId = destinationId;
      if (typeof destinationId === 'string' && destinationGuidMap[destinationId]) {
        effectiveDestinationId = destinationGuidMap[destinationId];
        console.log(`目的地ID "${destinationId}" 已映射到GUID: ${effectiveDestinationId}`);
      }
      
      const reviewData = {
        destinationId: effectiveDestinationId,
        content: newReview,
        rating: newRating,
        // 确保游客评论始终提供这些字段
        guestName: guestName || "游客",
        guestEmail: guestEmail || "guest@example.com",
        images: []
      };

      console.log('提交评论数据:', reviewData);

      const postUrl = `${API_BASE_URL}/api/reviews`;
      console.log('提交评论URL:', postUrl);
      
      // 使用类型断言处理session.accessToken
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...((session as any)?.accessToken ? { 'Authorization': `Bearer ${(session as any).accessToken}` } : {})
      };
      console.log('请求头:', headers);
      
      const response = await fetch(postUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(reviewData)
      });

      // 增强错误处理
      if (!response.ok) {
        console.error('提交评论失败状态:', response.status, response.statusText);
        
        let errorMessage = '提交评论失败';
        try {
          const errorText = await response.text();
          console.error('错误响应内容:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || `提交评论失败: ${response.status}`;
            console.error('解析后的错误信息:', errorData);
          } catch (e) {
            console.error('错误响应不是有效的JSON格式');
            errorMessage = `提交评论失败: ${response.status} ${response.statusText}`;
          }
        } catch (e) {
          console.error('无法读取错误响应内容');
        }
        
        throw new Error(errorMessage);
      }

      // 处理成功响应
      const result = await response.json();
      console.log('评论提交成功:', result);

      // 重置表单
      setNewReview('');
      setNewRating(5);
      setGuestName('');
      setGuestEmail('');

      // 重新获取评论数据
      fetchReviewData();
      
    } catch (error: any) {
      console.error('评论提交过程中出错:', error);
      setError(error.message || '提交评论失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-section">
      {/* 评论统计部分 */}
      <div className="review-overview">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{statistics.averageRating.toFixed(1)}</span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`star-icon ${i < Math.floor(statistics.averageRating) ? 'filled' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="total-reviews">({statistics.totalReviews} 条评价)</span>
          </div>
          
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = statistics.ratingDistribution[rating.toString()] || 0;
              const percentage = statistics.totalReviews > 0 
                ? Math.round((count / statistics.totalReviews) * 100) 
                : 0;
                
              return (
                <div key={rating} className="rating-bar-item">
                  <div className="rating-label">{rating} 星</div>
                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="rating-percentage">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 错误信息显示 */}
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px 0', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {/* 评论列表部分 */}
      <div className="review-list">
        {loading ? (
          <div className="loading-reviews" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>加载中...</div>
            <div>正在获取评论数据，请稍候</div>
          </div>
        ) : displayedReviews && displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <img
                      src={review.userAvatar || "/images/avatars/default.jpg"}
                      alt={review.userName}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.warn(`头像加载失败: ${review.userAvatar}`);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/avatars/default.jpg";
                      }}
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
                      <img
                        src={img}
                        alt={`评价配图 ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          console.warn(`评论图片加载失败: ${img}`);
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-reviews" style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>暂无评论</div>
            <div>成为第一个分享体验的旅行者吧</div>
          </div>
        )}
      </div>
      
      {/* 显示更多按钮 */}
      {reviews.length > 3 && (
        <div className="show-more">
          <button
            className="show-more-button"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? '收起评价' : `查看全部 ${statistics.totalReviews} 条评价`}
          </button>
        </div>
      )}
      
      {/* 评论表单部分 */}
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
          
          {!session && (
            <>
              <div className="form-field">
                <label>您的姓名：</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>您的邮箱（选填）：</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="请输入您的邮箱"
                  className="form-input"
                />
              </div>
            </>
          )}
          
          <div className="review-textarea">
            <textarea
              placeholder="请分享您的旅行体验和建议..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-review-button" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交评价'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
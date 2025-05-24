'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface WishlistItem {
  id: string;
  destinationId: string;
  destinationTitle: string;
  destinationImage?: string;
  destinationLocation?: string;
  destinationPrice?: number;
  destinationRating?: number;
  notes?: string;
  createdAt: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?message=login-required-wishlist');
      return;
    }

    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      } else {
        setError('获取收藏列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (destinationId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${destinationId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.destinationId !== destinationId));
      } else {
        alert('移除失败，请稍后重试');
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar transparent={false} />
        <div className="wishlist-loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar transparent={false} />
      
      <div className="wishlist-page">
        <div className="wishlist-container">
          {/* 页面头部 */}
          <div className="wishlist-header">
            <div className="header-content">
              <h1 className="page-title">我的收藏</h1>
              <p className="page-subtitle">
                {wishlistItems.length > 0 
                  ? `您收藏了 ${wishlistItems.length} 个目的地`
                  : '还没有收藏任何目的地'
                }
              </p>
            </div>
            
            {session?.user && (
              <div className="user-info">
                <div className="user-avatar">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="用户头像"
                      width={48}
                      height={48}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <h3>{session.user.name}</h3>
                  <p>{session.user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="error-message">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* 收藏列表 */}
          {wishlistItems.length > 0 ? (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="card-image">
                    {item.destinationImage ? (
                      <Image
                        src={item.destinationImage}
                        alt={item.destinationTitle}
                        fill
                        className="destination-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <button
                      className="remove-button"
                      onClick={() => removeFromWishlist(item.destinationId)}
                      title="移除收藏"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="destination-title">{item.destinationTitle}</h3>
                    
                    {item.destinationLocation && (
                      <div className="location">
                        <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{item.destinationLocation}</span>
                      </div>
                    )}
                    
                    <div className="card-meta">
                      {item.destinationRating && (
                        <div className="rating">
                          <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{item.destinationRating}</span>
                        </div>
                      )}
                      
                      {item.destinationPrice && (
                        <div className="price">
                          ¥{item.destinationPrice}
                        </div>
                      )}
                    </div>
                    
                    <div className="collection-date">
                      收藏于 {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                    
                    <Link
                      href={`/destinations/${item.destinationId}`}
                      className="view-button"
                    >
                      查看详情
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3>还没有收藏</h3>
              <p>探索我们的目的地，收藏您感兴趣的地方</p>
              <Link href="/destinations" className="explore-button">
                探索目的地
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      <style jsx>{`
        .wishlist-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding-top: 80px;
        }
        
        .wishlist-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          color: #666;
          font-size: 16px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-avatar {
          position: relative;
        }
        
        .avatar-image {
          border-radius: 50%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
        }
        
        .user-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .user-details p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
        
        .wishlist-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }
        
        .loading-content {
          text-align: center;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .error-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        
        .wishlist-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .wishlist-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .card-image {
          position: relative;
          height: 200px;
          background-color: #f0f0f0;
        }
        
        .destination-image {
          object-fit: cover;
        }
        
        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .image-placeholder svg {
          width: 48px;
          height: 48px;
        }
        
        .remove-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666;
        }
        
        .remove-button:hover {
          background: #ff4757;
          color: white;
          transform: scale(1.1);
        }
        
        .remove-button svg {
          width: 16px;
          height: 16px;
        }
        
        .card-content {
          padding: 20px;
        }
        
        .destination-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        
        .location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666;
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        .location-icon {
          width: 16px;
          height: 16px;
        }
        
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ffc107;
          font-size: 14px;
          font-weight: 500;
        }
        
        .star-icon {
          width: 16px;
          height: 16px;
        }
        
        .price {
          font-size: 18px;
          font-weight: 600;
          color: #3498db;
        }
        
        .collection-date {
          font-size: 12px;
          color: #999;
          margin-bottom: 16px;
        }
        
        .view-button {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .view-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          color: #ddd;
        }
        
        .empty-icon svg {
          width: 100%;
          height: 100%;
        }
        
        .empty-state h3 {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }
        
        .empty-state p {
          color: #666;
          font-size: 16px;
          margin-bottom: 32px;
        }
        
        .explore-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .explore-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        @media (max-width: 768px) {
          .wishlist-container {
            padding: 20px 16px;
          }
          
          .wishlist-header {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }
          
          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .page-title {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}
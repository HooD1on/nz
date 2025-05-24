'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { wishlistService } from '../../lib/services/wishlistService';
import { mapToGuid, getDisplayId } from '../../lib/data/utils/destinationMapping';

interface DestinationActionProps {
  destinationId: string;
  destinationTitle: string;
  destinationImage?: string;
  destinationLocation?: string;
  destinationPrice?: number;
  destinationRating?: number;
}

const DestinationAction: React.FC<DestinationActionProps> = ({
  destinationId,
  destinationTitle,
  destinationImage,
  destinationLocation,
  destinationPrice,
  destinationRating
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 现有状态
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // 收藏相关状态
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');

  // 输出调试信息
  useEffect(() => {
    console.log('DestinationAction 组件初始化:', {
      originalId: destinationId,
      mappedId: mapToGuid(destinationId),
      displayId: getDisplayId(destinationId),
      title: destinationTitle
    });
  }, [destinationId, destinationTitle]);

  // 检查收藏状态
  useEffect(() => {
    if (status === 'authenticated') {
      checkWishlistStatus();
    }
  }, [status, destinationId]);

  const checkWishlistStatus = async () => {
    try {
      // 使用原始ID进行检查，wishlistService内部会处理映射
      const result = await wishlistService.checkWishlistStatus(destinationId);
      setIsFavorite(result.isInWishlist);
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (status !== 'authenticated') {
      router.push('/auth?message=login-required-wishlist&redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setFavoriteLoading(true);
    setFavoriteError('');

    try {
      if (isFavorite) {
        // 移除收藏 - 使用原始ID，service内部会处理映射
        const result = await wishlistService.removeFromWishlist(destinationId);
        if (result.success) {
          setIsFavorite(false);
        } else {
          setFavoriteError(result.error || '移除收藏失败');
        }
      } else {
        // 添加收藏 - 使用原始ID，service内部会处理映射
        const wishlistData = {
          destinationId, // 保持原始ID，让service处理映射
          destinationTitle,
          destinationImage,
          destinationLocation,
          destinationPrice,
          destinationRating
        };

        console.log('准备添加收藏:', wishlistData);

        const result = await wishlistService.addToWishlist(wishlistData);
        if (result.success) {
          setIsFavorite(true);
        } else {
          setFavoriteError(result.error || '添加收藏失败');
        }
      }
    } catch (error: any) {
      setFavoriteError(error.message || '操作失败，请稍后重试');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 其余代码保持不变...
  const handleShare = () => {
    setShowDropdown(!showDropdown);
  };

  const shareVia = (platform: string) => {
    const url = window.location.href;
    const title = `${destinationTitle} - 新西兰旅游`;
    
    switch (platform) {
      case 'wechat':
        navigator.clipboard.writeText(`${title} ${url}`);
        alert('链接已复制到剪贴板，可以粘贴到微信分享');
        break;
      case 'weibo':
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
        break;
      case 'qzone':
        window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
        break;
    }
    setShowDropdown(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交表单', { name, phone, email, message, destinationId: mapToGuid(destinationId) });
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const getFavoriteButtonContent = () => {
    if (favoriteLoading) {
      return {
        icon: (
          <svg className="action-icon animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
        text: '处理中...'
      };
    }

    if (status !== 'authenticated') {
      return {
        icon: (
          <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        text: '收藏'
      };
    }

    return {
      icon: (
        <svg 
          className="action-icon" 
          fill={isFavorite ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      ),
      text: isFavorite ? '已收藏' : '收藏'
    };
  };

  const favoriteContent = getFavoriteButtonContent();

  return (
    <div className="destination-action">
      <div className="action-card">
        {favoriteError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{favoriteError}</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className={`action-button favorite-button ${isFavorite ? 'active' : ''} ${favoriteLoading ? 'loading' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            {favoriteContent.icon}
            <span className="action-text">{favoriteContent.text}</span>
          </button>

          <div className="share-container">
            <button className="action-button share-button" onClick={handleShare}>
              <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="action-text">分享</span>
            </button>
            
            {showDropdown && (
              <div className="share-dropdown">
                <button className="share-option" onClick={() => shareVia('wechat')}>
                  <span>微信</span>
                </button>
                <button className="share-option" onClick={() => shareVia('weibo')}>
                  <span>微博</span>
                </button>
                <button className="share-option" onClick={() => shareVia('qzone')}>
                  <span>QQ空间</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 现有的表单代码保持不变 */}
        <div className="inquiry-form">
          <h3 className="form-title">咨询预订</h3>
          <p className="form-subtitle">填写下方表单，我们将有专人与您联系</p>
          
          {showSuccess ? (
            <div className="success-message">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>提交成功！我们会尽快联系您</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                  placeholder="请输入您的姓名"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">电话</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  placeholder="请输入您的联系电话"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入您的邮箱（选填）"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">留言</label>
                <textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="请输入您的具体需求（选填）"
                  rows={3}
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                提交咨询
              </button>
            </form>
          )}
          
          <div className="contact-info">
            <p>或直接联系我们:</p>
            <div className="contact-item">
              <span>400-123-4567</span>
            </div>
            <div className="contact-item">
              <span>info@nztourism.com</span>
            </div>
          </div>
        </div>

        {status !== 'authenticated' && (
          <div className="login-prompt">
            <div className="prompt-content">
              <p>登录后即可收藏目的地，方便随时查看您的旅行计划</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationAction;
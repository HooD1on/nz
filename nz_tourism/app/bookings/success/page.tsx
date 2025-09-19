// nz_tourism/app/booking/success/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/components/button.css';

interface BookingDetails {
  id: string;
  bookingReference: string;
  packageId: string;
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  travelDate: string;
  totalAmount: number;
  currency: string;
  status: string;
  specialRequests?: string;
  createdAt: string;
  packageTitle?: string;
  packageImage?: string;
  packageDuration?: string;
}

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const paymentIntent = searchParams?.get('payment_intent');
    const bookingId = searchParams?.get('booking_id');

    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth?message=login-required');
      return;
    }

    if (!paymentIntent) {
      setError('缺少支付信息，请重新预订');
      setLoading(false);
      return;
    }

    fetchBookingDetails(paymentIntent, bookingId);
  }, [searchParams, router, status]);

  const fetchBookingDetails = async (paymentIntent: string, bookingId?: string | null) => {
    try {
      setLoading(true);
      setError('');

      // 首先尝试通过booking ID获取详情
      if (bookingId) {
        const bookingResponse = await fetch(`/api/bookings/${bookingId}`);
        if (bookingResponse.ok) {
          const bookingData = await bookingResponse.json();
          setBooking(bookingData);
          setLoading(false);
          return;
        }
      }

      // 如果没有booking ID或获取失败，尝试通过支付ID获取
      const paymentResponse = await fetch(`/api/payments/stripe-status/${paymentIntent}`);
      if (!paymentResponse.ok) {
        throw new Error('获取支付信息失败');
      }

      const paymentData = await paymentResponse.json();
      
      if (paymentData.status !== 'succeeded') {
        throw new Error('支付尚未完成');
      }

      // 创建模拟预订详情（实际项目中应该从后端获取）
      const mockBooking: BookingDetails = {
        id: bookingId || `booking_${Date.now()}`,
        bookingReference: `WS-${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
        packageId: 'unknown',
        customerName: session?.user?.name || '客户',
        email: session?.user?.email || '',
        phone: '',
        travelers: 2,
        travelDate: new Date().toISOString().split('T')[0],
        totalAmount: paymentData.localAmount / 100 || 0,
        currency: paymentData.localCurrency || 'NZD',
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        packageTitle: '新西兰旅游套餐',
        packageImage: '/images/default-package.jpg',
        packageDuration: '多日游'
      };

      setBooking(mockBooking);

    } catch (err: any) {
      console.error('获取预订详情失败:', err);
      setError(err.message || '获取预订详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSendConfirmationEmail = async () => {
    if (!booking) return;

    try {
      setEmailSent(true);
      // 这里应该调用后端API发送确认邮件
      // await fetch('/api/bookings/send-confirmation', { ... });
      
      // 模拟发送邮件
      setTimeout(() => {
        alert('确认邮件已发送到您的邮箱！');
      }, 1000);
    } catch (err) {
      console.error('发送确认邮件失败:', err);
      alert('发送邮件失败，请稍后重试');
      setEmailSent(false);
    }
  };

  const handleDownloadConfirmation = () => {
    if (!booking) return;

    // 创建确认单内容
    const confirmationContent = `
新西兰旅游预订确认单

预订编号: ${booking.bookingReference}
客户姓名: ${booking.customerName}
邮箱地址: ${booking.email}
联系电话: ${booking.phone}
套餐名称: ${booking.packageTitle}
出行人数: ${booking.travelers}人
出行日期: ${booking.travelDate}
总金额: $${booking.totalAmount} ${booking.currency}
预订状态: 已确认
预订时间: ${new Date(booking.createdAt).toLocaleString('zh-CN')}

感谢您选择我们的服务！
如有任何问题，请联系客服。
    `.trim();

    // 创建并下载文件
    const blob = new Blob([confirmationContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `预订确认单_${booking.bookingReference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (!booking) return;

    const shareData = {
      title: '新西兰旅游预订成功',
      text: `我刚刚预订了${booking.packageTitle}，预订编号：${booking.bookingReference}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // 复制到剪贴板作为备选方案
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      ).then(() => {
        alert('分享内容已复制到剪贴板！');
      });
    }
  };

  if (loading) {
    return (
      <div className="success-loading">
        <div className="loading-spinner"></div>
        <p>正在获取预订详情...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-error">
        <div className="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2>获取预订信息失败</h2>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="retry-btn">
            重新获取
          </button>
          <Link href="/" className="home-btn">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="success-error">
        <div className="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.513.751-6.293 2.015.506.268 1.078.406 1.668.406H18c.59 0 1.162-.138 1.668-.406z" />
          </svg>
        </div>
        <h2>未找到预订信息</h2>
        <p>请检查您的预订确认邮件或联系客服</p>
        <Link href="/" className="home-btn">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        {/* 成功标题 */}
        <div className="success-header">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1>预订成功！</h1>
          <p>感谢您选择我们的新西兰旅游服务</p>
        </div>

        {/* 预订详情卡片 */}
        <div className="booking-card">
          <div className="card-header">
            <div className="booking-reference">
              <span className="reference-label">预订编号</span>
              <span className="reference-number">{booking.bookingReference}</span>
            </div>
            <div className="booking-status">
              <span className={`status-badge ${booking.status.toLowerCase()}`}>
                {booking.status === 'Confirmed' ? '已确认' : booking.status}
              </span>
            </div>
          </div>

          <div className="card-content">
            {/* 套餐信息 */}
            <div className="package-info">
              <div className="package-image">
                <Image
                  src={booking.packageImage || '/images/default-package.jpg'}
                  alt={booking.packageTitle || '旅游套餐'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="package-details">
                <h3>{booking.packageTitle}</h3>
                <p>{booking.packageDuration}</p>
              </div>
            </div>

            {/* 客户信息 */}
            <div className="booking-details">
              <div className="detail-section">
                <h4>客户信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">姓名</span>
                    <span className="detail-value">{booking.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">邮箱</span>
                    <span className="detail-value">{booking.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">电话</span>
                    <span className="detail-value">{booking.phone || '未提供'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>行程信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">出行人数</span>
                    <span className="detail-value">{booking.travelers}人</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">出行日期</span>
                    <span className="detail-value">{booking.travelDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">预订时间</span>
                    <span className="detail-value">
                      {new Date(booking.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="detail-section">
                  <h4>特殊要求</h4>
                  <div className="special-requests">
                    {booking.specialRequests}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>费用明细</h4>
                <div className="price-summary">
                  <div className="price-row total">
                    <span>总金额</span>
                    <span className="price">${booking.totalAmount} {booking.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="action-buttons">
          <button
            onClick={handleDownloadConfirmation}
            className="btn btn--success"
          >
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            下载确认单
          </button>

          <button
            onClick={handleSendConfirmationEmail}
            disabled={emailSent}
            className="btn btn--info"
          >
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {emailSent ? '已发送' : '发送确认邮件'}
          </button>

          <button
            onClick={handleShare}
            className="btn btn--ghost"
          >
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            分享
          </button>
        </div>

        {/* 后续步骤 */}
        <div className="next-steps">
          <h3>后续步骤</h3>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>保存确认信息</h4>
                <p>请保存您的预订编号和确认单，出行时需要出示</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>准备出行材料</h4>
                <p>请提前准备护照、签证等出行所需材料</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>客服联系</h4>
                <p>我们的客服团队将在24小时内与您联系，确认行程细节</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="bottom-navigation">
          <Link href="/my-bookings" className="btn btn--secondary btn--nav">
            查看我的预订
          </Link>
          <Link href="/" className="btn btn--primary btn--nav">
            继续浏览
          </Link>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }

        .success-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .success-icon svg {
          width: 48px;
          height: 48px;
          color: #10b981;
        }

        .success-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .success-header p {
          font-size: 1.125rem;
          color: rgba(255,255,255,0.9);
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          margin-bottom: 32px;
        }

        .card-header {
          background: #f8f9fa;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .booking-reference {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reference-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .reference-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          font-family: monospace;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-badge.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .card-content {
          padding: 32px 24px;
        }

        .package-info {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .package-image {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .package-details h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .package-details p {
          color: #6b7280;
        }

        .detail-section {
          margin-bottom: 32px;
        }

        .detail-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-weight: 600;
          color: #111827;
        }

        .special-requests {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          color: #374151;
          line-height: 1.6;
        }

        .price-summary {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-row.total {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .price {
          color: #10b981;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .download-btn {
          background: #3b82f6;
          color: white;
        }

        .download-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .email-btn {
          background: #10b981;
          color: white;
        }

        .email-btn:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .email-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }

        .share-btn {
          background: #8b5cf6;
          color: white;
        }

        .share-btn:hover {
          background: #7c3aed;
          transform: translateY(-2px);
        }

        .next-steps {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .next-steps h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 24px;
          text-align: center;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .step-content p {
          color: #6b7280;
          line-height: 1.5;
        }

        .bottom-navigation {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .nav-btn {
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          text-align: center;
          min-width: 150px;
        }

        .nav-btn.secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .nav-btn.secondary:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .nav-btn.primary {
          background: white;
          color: #3b82f6;
        }

        .nav-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .success-loading,
        .success-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          color: white;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-icon {
          width: 80px;
          height: 80px;
          background: rgba(239, 68, 68, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .error-icon svg {
          width: 48px;
          height: 48px;
          color: #ef4444;
        }

        .success-error h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .success-error p {
          font-size: 1.125rem;
          margin-bottom: 24px;
          opacity: 0.9;
        }

        .error-actions {
          display: flex;
          gap: 16px;
        }

        .retry-btn,
        .home-btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .retry-btn {
          background: white;
          color: #3b82f6;
        }

        .home-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
          .success-page {
            padding: 20px 16px;
          }
          
          .success-header h1 {
            font-size: 2rem;
          }
          
          .card-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .package-info {
            flex-direction: column;
            text-align: center;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .bottom-navigation {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="success-loading">
        <div className="loading-spinner"></div>
        <p>正在获取预订详情...</p>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}

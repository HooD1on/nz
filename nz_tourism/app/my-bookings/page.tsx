// nz_tourism/app/my-bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface Booking {
  id: string;
  bookingReference: string;
  packageId: string;
  packageTitle?: string;
  packageImage?: string;
  packageDuration?: string;
  customerName: string;
  email: string;
  phone?: string;
  travelers: number;
  travelDate: string;
  totalAmount: number;
  currency: string;
  status: 'Confirmed' | 'Cancelled' | 'Pending' | 'Completed';
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

const statusConfig = {
  'Confirmed': {
    label: '已确认',
    color: 'confirmed',
    bgColor: '#d1fae5',
    textColor: '#065f46'
  },
  'Pending': {
    label: '待确认',
    color: 'pending',
    bgColor: '#fef3c7',
    textColor: '#92400e'
  },
  'Cancelled': {
    label: '已取消',
    color: 'cancelled',
    bgColor: '#fee2e2',
    textColor: '#991b1b'
  },
  'Completed': {
    label: '已完成',
    color: 'completed',
    bgColor: '#e0e7ff',
    textColor: '#3730a3'
  }
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?message=login-required&redirect=/my-bookings');
      return;
    }

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/bookings/my-bookings');
      
      if (!response.ok) {
        if (response.status === 404) {
          // 没有预订记录
          setBookings([]);
          return;
        }
        throw new Error('获取预订列表失败');
      }

      const data = await response.json();
      
      // 如果后端还没有实现，使用模拟数据
      if (!data || data.length === 0) {
        setBookings(generateMockBookings());
      } else {
        setBookings(data);
      }

    } catch (err: any) {
      console.error('获取预订列表失败:', err);
      // 在开发阶段使用模拟数据
      setBookings(generateMockBookings());
      // setError(err.message || '获取预订列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟数据（开发阶段使用）
  const generateMockBookings = (): Booking[] => {
    return [
      {
        id: '1',
        bookingReference: 'WS-2024001234',
        packageId: '1',
        packageTitle: 'North Island Explorer',
        packageImage: '/images/north-island.jpg',
        packageDuration: '8天7晚',
        customerName: session?.user?.name || '张三',
        email: session?.user?.email || 'test@example.com',
        phone: '+64 21 123 4567',
        travelers: 2,
        travelDate: '2024-03-15',
        totalAmount: 5998,
        currency: 'NZD',
        status: 'Confirmed',
        createdAt: '2024-01-15T10:30:00Z',
        confirmedAt: '2024-01-15T11:00:00Z',
        specialRequests: '希望安排靠窗的房间'
      },
      {
        id: '2',
        bookingReference: 'WS-2024001235',
        packageId: '2',
        packageTitle: 'South Island Adventure',
        packageImage: '/images/south-island.jpg',
        packageDuration: '10天9晚',
        customerName: session?.user?.name || '李四',
        email: session?.user?.email || 'test@example.com',
        phone: '+64 21 987 6543',
        travelers: 4,
        travelDate: '2024-04-20',
        totalAmount: 14396,
        currency: 'NZD',
        status: 'Pending',
        createdAt: '2024-01-20T14:15:00Z'
      },
      {
        id: '3',
        bookingReference: 'WS-2024001236',
        packageId: '3',
        packageTitle: 'Maori Culture Experience',
        packageImage: '/images/maori-culture.jpg',
        packageDuration: '5天4晚',
        customerName: session?.user?.name || '王五',
        email: session?.user?.email || 'test@example.com',
        travelers: 1,
        travelDate: '2023-12-10',
        totalAmount: 1999,
        currency: 'NZD',
        status: 'Completed',
        createdAt: '2023-11-15T09:45:00Z',
        confirmedAt: '2023-11-15T10:15:00Z'
      }
    ];
  };

  // 过滤和排序预订
  const filteredAndSortedBookings = bookings
    .filter(booking => {
      const matchesSearch = booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.packageTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('确定要取消这个预订吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('取消预订失败');
      }

      // 更新本地状态
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'Cancelled' as const, cancelledAt: new Date().toISOString() }
          : booking
      ));

      alert('预订已成功取消');
    } catch (err: any) {
      console.error('取消预订失败:', err);
      alert(err.message || '取消预订失败，请稍后重试');
    }
  };

  const handleDownloadVoucher = (booking: Booking) => {
    const voucherContent = `
新西兰旅游预订凭证

预订编号: ${booking.bookingReference}
客户姓名: ${booking.customerName}
套餐名称: ${booking.packageTitle}
出行人数: ${booking.travelers}人
出行日期: ${booking.travelDate}
总金额: $${booking.totalAmount} ${booking.currency}
预订状态: ${statusConfig[booking.status].label}
预订时间: ${new Date(booking.createdAt).toLocaleString('zh-CN')}

请在出行时携带此凭证。
如有疑问，请联系客服。
    `.trim();

    const blob = new Blob([voucherContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `预订凭证_${booking.bookingReference}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="bookings-loading">
        <div className="loading-spinner"></div>
        <p>加载预订列表中...</p>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        {/* 页面标题 */}
        <div className="page-header">
          <h1>我的预订</h1>
          <p>管理您的旅游预订和查看行程安排</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="filters-section">
          <div className="search-box">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索预订编号、套餐名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">全部状态</option>
              <option value="Confirmed">已确认</option>
              <option value="Pending">待确认</option>
              <option value="Completed">已完成</option>
              <option value="Cancelled">已取消</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="filter-select"
            >
              <option value="date-desc">最新预订</option>
              <option value="date-asc">最早预订</option>
              <option value="amount-desc">价格从高到低</option>
              <option value="amount-asc">价格从低到高</option>
              <option value="status-asc">按状态排序</option>
            </select>
          </div>
        </div>

        {/* 预订列表 */}
        {error && (
          <div className="error-message">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={fetchBookings} className="retry-btn">重试</button>
          </div>
        )}

        {filteredAndSortedBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3>暂无预订记录</h3>
            <p>您还没有任何预订，赶快去探索我们的旅游套餐吧！</p>
            <Link href="/" className="explore-btn">
              探索套餐
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredAndSortedBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="card-header">
                  <div className="booking-info">
                    <span className="booking-reference">{booking.bookingReference}</span>
                    <div 
                      className="status-badge"
                      style={{
                        backgroundColor: statusConfig[booking.status].bgColor,
                        color: statusConfig[booking.status].textColor
                      }}
                    >
                      {statusConfig[booking.status].label}
                    </div>
                  </div>
                  <div className="booking-date">
                    {new Date(booking.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>

                <div className="card-content">
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
                      <p className="package-duration">{booking.packageDuration}</p>
                      <div className="booking-details">
                        <span className="detail-item">
                          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {booking.travelers}人
                        </span>
                        <span className="detail-item">
                          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8m0 0V9a2 2 0 012-2h4a2 2 0 012 2v8m0 0v4a2 2 0 01-2 2H10a2 2 0 01-2-2z" />
                          </svg>
                          {booking.travelDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="price-info">
                    <span className="price-amount">${booking.totalAmount}</span>
                    <span className="price-currency">{booking.currency}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="btn btn--outline"
                  >
                    查看详情
                  </button>
                  
                  {booking.status === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => handleDownloadVoucher(booking)}
                        className="btn btn--success"
                      >
                        下载凭证
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn btn--danger"
                      >
                        取消预订
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'Completed' && (
                    <button
                      onClick={() => handleDownloadVoucher(booking)}
                      className="action-btn download-btn"
                    >
                      下载凭证
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 预订详情模态框 */}
        {showDetailModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>预订详情</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="close-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h4>基本信息</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span>预订编号</span>
                      <span>{selectedBooking.bookingReference}</span>
                    </div>
                    <div className="detail-row">
                      <span>预订状态</span>
                      <span 
                        className="status-text"
                        style={{ color: statusConfig[selectedBooking.status].textColor }}
                      >
                        {statusConfig[selectedBooking.status].label}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>套餐名称</span>
                      <span>{selectedBooking.packageTitle}</span>
                    </div>
                    <div className="detail-row">
                      <span>套餐时长</span>
                      <span>{selectedBooking.packageDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>客户信息</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span>姓名</span>
                      <span>{selectedBooking.customerName}</span>
                    </div>
                    <div className="detail-row">
                      <span>邮箱</span>
                      <span>{selectedBooking.email}</span>
                    </div>
                    <div className="detail-row">
                      <span>电话</span>
                      <span>{selectedBooking.phone || '未提供'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>行程信息</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span>出行人数</span>
                      <span>{selectedBooking.travelers}人</span>
                    </div>
                    <div className="detail-row">
                      <span>出行日期</span>
                      <span>{selectedBooking.travelDate}</span>
                    </div>
                    <div className="detail-row">
                      <span>预订时间</span>
                      <span>{new Date(selectedBooking.createdAt).toLocaleString('zh-CN')}</span>
                    </div>
                    {selectedBooking.confirmedAt && (
                      <div className="detail-row">
                        <span>确认时间</span>
                        <span>{new Date(selectedBooking.confirmedAt).toLocaleString('zh-CN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="detail-section">
                    <h4>特殊要求</h4>
                    <div className="special-requests">
                      {selectedBooking.specialRequests}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h4>费用信息</h4>
                  <div className="price-summary">
                    <div className="price-row total">
                      <span>总金额</span>
                      <span>${selectedBooking.totalAmount} {selectedBooking.currency}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => handleDownloadVoucher(selectedBooking)}
                  className="action-btn download-btn"
                >
                  下载凭证
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="action-btn close-btn-action"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bookings-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding-top: 80px;
        }

        .bookings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .page-header p {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .filters-section {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #991b1b;
          margin-bottom: 24px;
        }

        .error-icon {
          width: 20px;
          height: 20px;
          color: #ef4444;
        }

        .retry-btn {
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: auto;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          color: #9ca3af;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .explore-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .explore-btn:hover {
          background: #2563eb;
        }

        .bookings-grid {
          display: grid;
          gap: 24px;
        }

        .booking-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
        }

        .booking-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .booking-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .booking-reference {
          font-family: monospace;
          font-weight: 700;
          font-size: 1.125rem;
          color: #111827;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .booking-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .card-content {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .package-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .package-image {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .package-details h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .package-duration {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 8px;
        }

        .booking-details {
          display: flex;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .detail-icon {
          width: 16px;
          height: 16px;
        }

        .price-info {
          text-align: right;
        }

        .price-amount {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
        }

        .price-currency {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          background: #fafbfc;
        }

        .action-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f9fafb;
        }

        .view-btn {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .view-btn:hover {
          background: #eff6ff;
        }

        .download-btn {
          color: #10b981;
          border-color: #10b981;
        }

        .download-btn:hover {
          background: #ecfdf5;
        }

        .cancel-btn {
          color: #ef4444;
          border-color: #ef4444;
        }

        .cancel-btn:hover {
          background: #fef2f2;
        }

        .bookings-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 模态框样式 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .close-btn svg {
          width: 20px;
          height: 20px;
        }

        .modal-body {
          padding: 24px;
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
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .detail-row span:first-child {
          color: #6b7280;
          font-weight: 500;
        }

        .detail-row span:last-child {
          color: #111827;
          font-weight: 500;
        }

        .status-text {
          font-weight: 600;
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
          border-radius: 8px;
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

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .close-btn-action {
          background: #6b7280;
          color: white;
          border: none;
        }

        .close-btn-action:hover {
          background: #4b5563;
        }

        @media (max-width: 768px) {
          .bookings-container {
            padding: 20px 16px;
          }
          
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            max-width: none;
          }
          
          .card-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .price-info {
            text-align: left;
            align-self: flex-end;
          }
          
          .card-actions {
            flex-wrap: wrap;
          }
          
          .modal-content {
            margin: 20px;
            max-height: calc(100vh - 40px);
          }
        }
      `}</style>
    </div>
  );
}
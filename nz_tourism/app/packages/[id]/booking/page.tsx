// nz_tourism/app/booking/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../../../lib/stripe';
import PaymentForm from '../../../../components/payment/PaymentForm';
import { BookingFormData } from '../../../../types/booking';
import { Package } from '../../../../types/package';

// 模拟套餐数据 - 与packages/[id]/page.tsx保持一致
const packages: { [key: string]: Package } = {
  '1': {
    id: '1',
    title: 'North Island Explorer',
    description: 'Discover the beauty of New Zealand\'s North Island, from the vibrant city of Auckland to the cultural capital Wellington.',
    imageUrl: '/images/north-island.jpg',
    price: 2999,
    duration: '8天7晚',
    rating: 4.8,
    reviewCount: 124,
    includes: [
      '奥克兰城市观光',
      '怀托摩萤火虫洞',
      '霍比特人村体验',
      '罗托鲁瓦地热公园',
      '惠灵顿文化之旅',
      '四星级酒店住宿',
      '专业中文导游',
      '景点门票'
    ]
  },
  '2': {
    id: '2',
    title: 'South Island Adventure',
    description: 'Experience the stunning landscapes of the South Island, including the adventure capital Queenstown and the garden city Christchurch.',
    imageUrl: '/images/south-island.jpg',
    price: 3599,
    duration: '10天9晚',
    rating: 4.9,
    reviewCount: 89,
    includes: [
      '皇后镇观光',
      '米尔福德峡湾游船',
      '冰川徒步体验',
      '基督城花园游览',
      '五星级酒店住宿',
      '专业英文导游',
      '所有交通费用',
      '特色餐饮体验'
    ]
  },
  '3': {
    id: '3',
    title: 'Maori Culture Experience',
    description: 'Immerse yourself in Maori culture with traditional performances, geothermal wonders, and authentic cultural experiences.',
    imageUrl: '/images/maori-culture.jpg',
    price: 1999,
    duration: '5天4晚',
    rating: 4.7,
    reviewCount: 156,
    includes: [
      '毛利文化村体验',
      '传统汉吉晚餐',
      '地热奇观游览',
      '毛利工艺品制作',
      '精品酒店住宿',
      '文化导游讲解',
      '往返交通',
      '文化纪念品'
    ]
  },
  'south-island-nature': {
    id: 'south-island-nature',
    title: '南岛自然探索之旅',
    description: '8天7晚深度游览新西兰南岛，体验最纯净的自然风光。',
    imageUrl: '/images/packages/south-island-nature.jpg',
    price: 2999,
    duration: '8天7晚',
    rating: 4.8,
    reviewCount: 124,
    includes: [
      '皇后镇观光',
      '米尔福德峡湾游船',
      '冰川徒步体验',
      '四星级酒店住宿',
      '专业中文导游'
    ]
  }
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    customerName: '',
    email: '',
    phone: '',
    travelers: 1,
    travelDate: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // 从URL参数获取套餐ID和人数
  useEffect(() => {
    const packageId = searchParams?.get('packageId');
    const travelers = searchParams?.get('travelers');

    if (packageId && packages[packageId]) {
      setPackageData(packages[packageId]);
      if (travelers) {
        setBookingData(prev => ({ ...prev, travelers: parseInt(travelers) || 1 }));
      }
    } else {
      // 如果没有套餐ID，重定向到首页
      router.push('/');
      return;
    }

    setLoading(false);
  }, [searchParams, router]);

  // 自动填充用户信息
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setBookingData(prev => ({
        ...prev,
        customerName: session.user?.name || '',
        email: session.user?.email || ''
      }));
    }
  }, [session, status]);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!bookingData.customerName.trim()) {
      newErrors.customerName = '请输入您的姓名';
    }

    if (!bookingData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!bookingData.phone.trim()) {
      newErrors.phone = '请输入您的电话号码';
    }

    if (!bookingData.travelDate) {
      newErrors.travelDate = '请选择出行日期';
    } else {
      const selectedDate = new Date(bookingData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.travelDate = '出行日期必须是未来的日期';
      }
    }

    if (bookingData.travelers < 1 || bookingData.travelers > 20) {
      newErrors.travelers = '出行人数必须在1-20人之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单输入
  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 继续到支付步骤
  const handleContinueToPayment = () => {
    if (status === 'unauthenticated') {
      const currentUrl = `/booking?packageId=${packageData?.id}&travelers=${bookingData.travelers}`;
      router.push(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  // 支付成功回调
  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('支付成功:', paymentIntent);
    // PaymentForm 组件会自动跳转到成功页面
  };

  // 支付错误回调
  const handlePaymentError = (error: string) => {
    console.error('支付错误:', error);
    alert(`支付失败：${error}`);
  };

  if (loading) {
    return (
      <div className="booking-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="booking-error">
        <h2>套餐未找到</h2>
        <p>请返回重新选择套餐</p>
        <button onClick={() => router.push('/')} className="back-button">
          返回首页
        </button>
      </div>
    );
  }

  const totalPrice = packageData.price * bookingData.travelers;

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* 进度指示器 */}
        <div className="booking-progress">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">填写信息</span>
            </div>
            <div className="progress-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">确认支付</span>
            </div>
          </div>
        </div>

        <div className="booking-content">
          {/* 套餐信息侧边栏 */}
          <div className="package-summary">
            <div className="package-header">
              <div className="package-image">
                <Image
                  src={packageData.imageUrl}
                  alt={packageData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="package-info">
                <h3 className="package-title">{packageData.title}</h3>
                <p className="package-duration">{packageData.duration}</p>
                <div className="package-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`star ${i < Math.floor(packageData.rating) ? 'filled' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span>{packageData.rating} ({packageData.reviewCount} 条评价)</span>
                </div>
              </div>
            </div>

            <div className="package-includes">
              <h4>套餐包含</h4>
              <ul>
                {packageData.includes.map((item, index) => (
                  <li key={index}>
                    <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>单价</span>
                <span>¥{packageData.price.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>人数</span>
                <span>{bookingData.travelers}人</span>
              </div>
              <div className="price-row total">
                <span>总计</span>
                <span>¥{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 主要内容区 */}
          <div className="booking-main">
            {currentStep === 1 && (
              <div className="booking-form">
                <h2>预订信息</h2>
                
                <div className="form-section">
                  <h3>联系信息</h3>
                  
                  <div className="form-group">
                    <label htmlFor="customerName">
                      姓名 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={bookingData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={errors.customerName ? 'error' : ''}
                      placeholder="请输入您的全名"
                    />
                    {errors.customerName && <span className="error-message">{errors.customerName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      邮箱 <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                      placeholder="请输入您的邮箱地址"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      电话号码 <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+64 21 123 4567"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-section">
                  <h3>出行详情</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="travelers">
                        出行人数 <span className="required">*</span>
                      </label>
                      <div className="travelers-input">
                        <button
                          type="button"
                          onClick={() => handleInputChange('travelers', Math.max(1, bookingData.travelers - 1))}
                          className="travelers-btn"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="travelers"
                          value={bookingData.travelers}
                          onChange={(e) => handleInputChange('travelers', parseInt(e.target.value) || 1)}
                          min="1"
                          max="20"
                          className="travelers-count"
                        />
                        <button
                          type="button"
                          onClick={() => handleInputChange('travelers', Math.min(20, bookingData.travelers + 1))}
                          className="travelers-btn"
                        >
                          +
                        </button>
                      </div>
                      {errors.travelers && <span className="error-message">{errors.travelers}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="travelDate">
                        出行日期 <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        id="travelDate"
                        value={bookingData.travelDate}
                        onChange={(e) => handleInputChange('travelDate', e.target.value)}
                        className={errors.travelDate ? 'error' : ''}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.travelDate && <span className="error-message">{errors.travelDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>特殊要求</h3>
                  <div className="form-group">
                    <label htmlFor="specialRequests">
                      备注信息（可选）
                    </label>
                    <textarea
                      id="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="请告诉我们您的特殊要求或备注..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => router.back()} className="back-btn">
                    返回
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="continue-btn"
                  >
                    继续支付
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-section">
                <h2>确认支付</h2>
                <p className="payment-note">
                  请确认您的预订信息，然后完成支付
                </p>
                
                <div className="booking-summary">
                  <h3>预订摘要</h3>
                  <div className="summary-item">
                    <span>姓名:</span>
                    <span>{bookingData.customerName}</span>
                  </div>
                  <div className="summary-item">
                    <span>邮箱:</span>
                    <span>{bookingData.email}</span>
                  </div>
                  <div className="summary-item">
                    <span>电话:</span>
                    <span>{bookingData.phone}</span>
                  </div>
                  <div className="summary-item">
                    <span>出行人数:</span>
                    <span>{bookingData.travelers}人</span>
                  </div>
                  <div className="summary-item">
                    <span>出行日期:</span>
                    <span>{bookingData.travelDate}</span>
                  </div>
                  {bookingData.specialRequests && (
                    <div className="summary-item">
                      <span>特殊要求:</span>
                      <span>{bookingData.specialRequests}</span>
                    </div>
                  )}
                </div>

                <Elements stripe={getStripe()}>
                  <PaymentForm
                    packageData={packageData}
                    bookingData={bookingData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="back-btn"
                  >
                    返回修改
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding-top: 80px;
        }

        .booking-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .booking-progress {
          margin-bottom: 40px;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          background: #e5e7eb;
          color: #6b7280;
          transition: all 0.3s;
        }

        .step.active .step-number {
          background: #3b82f6;
          color: white;
        }

        .step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .step.active .step-label {
          color: #3b82f6;
        }

        .progress-line {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 20px;
        }

        .booking-content {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 40px;
        }

        .package-summary {
          background: white;
          border-radius: 12px;
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .package-header {
          margin-bottom: 24px;
        }

        .package-image {
          position: relative;
          width: 100%;
          height: 160px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .package-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .package-duration {
          color: #6b7280;
          margin-bottom: 12px;
        }

        .package-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          width: 16px;
          height: 16px;
          color: #d1d5db;
        }

        .star.filled {
          color: #f59e0b;
        }

        .package-includes {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .package-includes h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }

        .package-includes ul {
          list-style: none;
          padding: 0;
        }

        .package-includes li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .check-icon {
          width: 16px;
          height: 16px;
          color: #10b981;
          margin-top: 2px;
          flex-shrink: 0;
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
          margin-bottom: 12px;
          font-size: 0.875rem;
        }

        .price-row.total {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }

        .booking-main {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .booking-form h2 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 32px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          display: block;
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 4px;
        }

        .travelers-input {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
        }

        .travelers-btn {
          width: 44px;
          height: 44px;
          border: none;
          background: #f9fafb;
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: bold;
          color: #6b7280;
          transition: background-color 0.2s;
        }

        .travelers-btn:hover {
          background: #e5e7eb;
        }

        .travelers-count {
          width: 80px;
          height: 44px;
          border: none;
          text-align: center;
          font-size: 1rem;
          font-weight: 600;
          background: white;
        }

        .travelers-count:focus {
          outline: none;
          background: #f9fafb;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }

        .back-btn {
          padding: 12px 24px;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .continue-btn {
          padding: 12px 32px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .continue-btn:hover {
          background: #2563eb;
        }

        .payment-section h2 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .payment-note {
          color: #6b7280;
          margin-bottom: 32px;
        }

        .booking-summary {
          background: #f9fafb;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 32px;
        }

        .booking-summary h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .summary-item span:first-child {
          color: #6b7280;
          font-weight: 500;
        }

        .summary-item span:last-child {
          color: #111827;
          font-weight: 500;
        }

        .booking-loading,
        .booking-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
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

        .back-button {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .booking-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .package-summary {
            position: static;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .booking-container {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="booking-loading"><div className="loading-spinner"></div><p>加载中...</p></div>}>
      <BookingContent />
    </Suspense>
  );
}
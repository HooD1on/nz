'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../../../lib/stripe';
import PaymentForm from '../../../../components/payment/PaymentForm';
import { BookingFormData } from '../../../../types/booking';
import { Package } from '../../../../types/package';
import '../../../../app/style/booking.css';

// 模拟套餐数据
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
  }
};

function BookingContent() {
  const router = useRouter();
  const params = useParams();
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

  // 初始化套餐数据
  useEffect(() => {
    const packageId = params?.id as string;
    const travelers = searchParams?.get('travelers');

    if (packageId && packages[packageId]) {
      setPackageData(packages[packageId]);
      if (travelers) {
        setBookingData(prev => ({ ...prev, travelers: parseInt(travelers) || 1 }));
      }
    } else {
      router.push('/');
      return;
    }

    setLoading(false);
  }, [params, searchParams, router]);

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
      const currentUrl = `/packages/${packageData?.id}/booking?travelers=${bookingData.travelers}`;
      router.push(`/auth?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  // 返回第一步
  const handleBackToForm = () => {
    setCurrentStep(1);
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
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
      }}>
        <h2 style={{
          color: '#111827',
          marginBottom: '12px',
          fontSize: '1.5rem'
        }}>套餐未找到</h2>
        <p>请返回重新选择套餐</p>
        <button 
          onClick={() => router.push('/')} 
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background 0.2s'
          }}
        >
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
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>填写信息</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>支付确认</span>
          </div>
        </div>

        {/* 套餐摘要 */}
        <div className="package-summary">
          <div className="package-info">
            <div className="package-image">
              <Image
                src={packageData.imageUrl}
                alt={packageData.title}
                width={120}
                height={80}
                className="rounded"
              />
            </div>
            <div className="package-details">
              <h3>{packageData.title}</h3>
              <p className="package-duration">{packageData.duration}</p>
              <p className="package-price">${packageData.price} / 人</p>
            </div>
          </div>
          <div className="price-summary">
            <div className="price-row">
              <span>套餐费用</span>
              <span>${packageData.price} × {bookingData.travelers}人</span>
            </div>
            <div className="price-row total">
              <span>总计</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* 步骤内容 */}
        <div className="booking-content">
          {currentStep === 1 && (
            <div className="booking-form-step">
              <h2>预订信息</h2>
              <form className="booking-form">
                <div className="form-group">
                  <label htmlFor="customerName">联系人姓名 *</label>
                  <input
                    type="text"
                    id="customerName"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={errors.customerName ? 'error' : ''}
                    placeholder="请输入您的姓名"
                  />
                  {errors.customerName && <span className="error-text">{errors.customerName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">邮箱地址 *</label>
                  <input
                    type="email"
                    id="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="请输入您的邮箱"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">手机号码 *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'error' : ''}
                    placeholder="请输入您的手机号码"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="travelers">出行人数 *</label>
                  <div className="travelers-control">
                    <button 
                      type="button" 
                      onClick={() => handleInputChange('travelers', Math.max(1, bookingData.travelers - 1))}
                      className="travelers-btn"
                      disabled={bookingData.travelers <= 1}
                    >
                      -
                    </button>
                    <span className="travelers-count">{bookingData.travelers}</span>
                    <button 
                      type="button" 
                      onClick={() => handleInputChange('travelers', Math.min(20, bookingData.travelers + 1))}
                      className="travelers-btn"
                      disabled={bookingData.travelers >= 20}
                    >
                      +
                    </button>
                  </div>
                  {errors.travelers && <span className="error-text">{errors.travelers}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="travelDate">出行日期 *</label>
                  <input
                    type="date"
                    id="travelDate"
                    value={bookingData.travelDate}
                    onChange={(e) => handleInputChange('travelDate', e.target.value)}
                    className={errors.travelDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.travelDate && <span className="error-text">{errors.travelDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">特殊要求</label>
                  <textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="如有特殊要求，请在此说明（选填）"
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={handleContinueToPayment}
                    className="btn btn--primary btn--lg"
                  >
                    继续支付
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 2 && (
            <div className="payment-step">
              <div className="step-header">
                <button 
                  onClick={handleBackToForm}
                  className="btn btn--ghost"
                >
                  ← 返回修改信息
                </button>
                <h2>支付确认</h2>
              </div>

              <div className="booking-summary">
                <h3>预订详情确认</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>联系人：</span>
                    <span>{bookingData.customerName}</span>
                  </div>
                  <div className="summary-item">
                    <span>邮箱：</span>
                    <span>{bookingData.email}</span>
                  </div>
                  <div className="summary-item">
                    <span>电话：</span>
                    <span>{bookingData.phone}</span>
                  </div>
                  <div className="summary-item">
                    <span>出行人数：</span>
                    <span>{bookingData.travelers}人</span>
                  </div>
                  <div className="summary-item">
                    <span>出行日期：</span>
                    <span>{bookingData.travelDate}</span>
                  </div>
                  {bookingData.specialRequests && (
                    <div className="summary-item full-width">
                      <span>特殊要求：</span>
                      <span>{bookingData.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>

              <Elements stripe={getStripe()}>
                <PaymentForm
                  packageData={packageData}
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
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
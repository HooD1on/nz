// 修复 nz_tourism/app/packages/[id]/booking/page.tsx 文件

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
  const params = useParams(); // 🔥 新增：获取路径参数
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

  // 🔥 修复：从路径参数获取套餐ID
  useEffect(() => {
    const packageId = params?.id as string; // 从路径参数获取套餐ID
    const travelers = searchParams?.get('travelers'); // 从查询参数获取人数

    if (packageId && packages[packageId]) {
      setPackageData(packages[packageId]);
      if (travelers) {
        setBookingData(prev => ({ ...prev, travelers: parseInt(travelers) || 1 }));
      }
    } else {
      // 如果没有套餐ID或套餐不存在，重定向到首页
      router.push('/');
      return;
    }

    setLoading(false);
  }, [params, searchParams, router]); // 🔥 更新依赖项

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
      // 🔥 修复：更新重定向URL
      const currentUrl = `/packages/${packageData?.id}/booking?travelers=${bookingData.travelers}`;
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

  // 继续渲染预订页面的其余部分...
  return (
    <div className="booking-page">
      {/* 预订页面的其余内容保持不变 */}
      <div className="booking-container">
        <div className="package-summary">
          <h2>预订：{packageData.title}</h2>
          <p>套餐价格：${packageData.price} / 人</p>
          <p>出行人数：{bookingData.travelers}人</p>
          <p>总价：${totalPrice}</p>
          
          <button onClick={handleContinueToPayment} className="continue-btn">
            继续支付
          </button>
        </div>
      </div>
    </div>
  );
}

// 主组件保持不变
export default function BookingPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BookingContent />
    </Suspense>
  );
}
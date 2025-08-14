// nz_tourism/components/NavigationHandler.tsx
'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavigationHandlerProps {
  children: React.ReactNode;
}

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // 🔥 关键：确保组件在客户端挂载后才执行逻辑
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 🔥 关键：只在客户端挂载后且状态不是 loading 时执行
    if (!mounted || status === 'loading') return;

    // 处理登录后的重定向
    const handleRedirect = () => {
      const redirect = searchParams?.get('redirect');
      const message = searchParams?.get('message');

      if (status === 'authenticated' && redirect) {
        // 用户已登录且有重定向URL
        router.push(decodeURIComponent(redirect));
      } else if (status === 'authenticated' && message === 'login-required-wishlist') {
        // 用户因为收藏功能需要登录，登录后跳转到收藏页面
        router.push('/wishlist');
      }
    };

    handleRedirect();
  }, [mounted, status, searchParams, router]); // 🔥 添加 mounted 依赖

  return <>{children}</>;
};

export default NavigationHandler;
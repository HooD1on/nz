import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavigationHandlerProps {
  children: React.ReactNode;
}

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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
  }, [status, searchParams, router]);

  return <>{children}</>;
};

export default NavigationHandler;
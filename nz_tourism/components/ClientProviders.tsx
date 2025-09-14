// nz_tourism/components/ClientProviders.tsx
'use client'

import { SessionProvider } from "next-auth/react"
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../lib/stripe';
import NavigationHandler from './NavigationHandler'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Stripe配置选项
const stripeOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    }
  },
  loader: 'auto' as const,
};

function HomepageDetector() {
  const pathname = usePathname()
  
  useEffect(() => {
    // 在客户端设置首页属性
    if (typeof window !== 'undefined') {
      if (pathname === '/' || pathname === '') {
        document.documentElement.setAttribute('data-homepage', 'true');
      } else {
        document.documentElement.removeAttribute('data-homepage');
      }
    }
  }, [pathname])
  
  return null
}

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <Elements stripe={getStripe()} options={stripeOptions}>
        <HomepageDetector />
        <NavigationHandler children={undefined} />
        
        <div className="layout-wrapper">
          <Navbar />
          <div className="main-content">
            {children}
          </div>
          <Footer />
        </div>
      </Elements>
    </SessionProvider>
  )
}
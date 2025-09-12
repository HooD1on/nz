'use client'

import './globals.css'
import '../styles/layout.css'
import '../styles/components.css'
import '../styles/sections.css'
import '../styles/destination.css'
import '../styles/home.css'

import { SessionProvider } from "next-auth/react"
import NavigationHandler from '../components/NavigationHandler'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../lib/stripe';
import { ReactNode } from 'react';

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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var path = window.location.pathname;
            if (path === '/' || path === '') {
              document.documentElement.setAttribute('data-homepage', 'true');
            } else {
              document.documentElement.removeAttribute('data-homepage');
            }
          })();
        `}} />
      </head>
      <body>
        <SessionProvider>
          <Elements stripe={getStripe()} options={stripeOptions}>
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
      </body>
    </html>
  )
}
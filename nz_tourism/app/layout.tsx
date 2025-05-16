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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          // 直接在HTML加载时执行，无需等待React
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
          {/* 导航处理组件 - 不渲染UI，只处理导航状态 */}
          <NavigationHandler />
          
          <div className="layout-wrapper">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
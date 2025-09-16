// nz_tourism/app/layout.tsx
import { Metadata } from 'next'
import './globals.css'
import '../styles/layout.css'
import '../styles/components.css'
import '../styles/sections.css'
import '../styles/destination.css'
import '../styles/home.css'
import '../styles/temp.css'              // 🆕 添加新的测试文件
import ClientProviders from '../components/ClientProviders'

export const metadata: Metadata = {
  title: 'WandSky - 新西兰旅游专家',
  description: '专业的新西兰旅游服务，为您提供最佳的旅行体验',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
// nz_tourism/app/layout.tsx
import { Metadata } from 'next'
import './globals.css'          // 保留精简版
import '../styles/index.css'    // 新的主入口文件     // 🆕 添加新的测试文件
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
// nz_tourism/components/Navbar.tsx (更新版)
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = true }: NavbarProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // 检测滚动状态
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    if (transparent) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [transparent])

  // 判断是否需要透明导航栏
  const shouldBeTransparent = transparent && !isScrolled && pathname === '/'
  
  // 导航链接配置
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/destinations', label: '目的地' },
    { href: '/packages', label: '旅游套餐' },
    { href: '/blog', label: '旅游博客' },
    { href: '/about', label: '关于我们' }
  ]

  // 用户菜单配置
  const userMenuItems = [
    { href: '/profile', label: '个人资料', icon: '👤' },
    { href: '/my-bookings', label: '我的预订', icon: '📋' },
    { href: '/wishlist', label: '我的收藏', icon: '❤️' },
    { href: '/settings', label: '设置', icon: '⚙️' }
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleLogin = () => {
    const currentPath = pathname
    if (currentPath && currentPath !== '/') {
      router.push(`/auth?redirect=${encodeURIComponent(currentPath)}`)
    } else {
      router.push('/auth')
    }
  }

  return (
    <nav className={`navbar ${shouldBeTransparent ? 'transparent' : 'solid'}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-text">WandSky</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="navbar-actions">
          {status === 'loading' ? (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          ) : session ? (
            <div className="user-menu">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="user-button"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="用户头像"
                    width={32}
                    height={32}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="user-name">{session.user?.name}</span>
                <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <span className="user-display-name">{session.user?.name}</span>
                      <span className="user-email">{session.user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-menu">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-label">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button
                    onClick={handleSignOut}
                    className="dropdown-item logout-item"
                  >
                    <span className="item-icon">🚪</span>
                    <span className="item-label">退出登录</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={handleLogin} className="login-button">
                登录
              </button>
              <Link href="/auth" className="signup-button">
                注册
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-menu-link ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="mobile-menu-divider"></div>
            
            {session ? (
              <>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-item-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleSignOut()
                  }}
                  className="mobile-menu-link logout"
                >
                  <span className="mobile-item-icon">🚪</span>
                  退出登录
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogin()
                  }}
                  className="mobile-menu-link"
                >
                  登录
                </button>
                <Link
                  href="/auth"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 0;
        }

        .navbar.transparent {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar.solid {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
        }

        .navbar-logo {
          text-decoration: none;
          font-size: 1.75rem;
          font-weight: 700;
          color: ${shouldBeTransparent ? 'white' : '#3b82f6'};
          transition: color 0.3s ease;
        }

        .navbar-logo:hover {
          color: ${shouldBeTransparent ? '#f0f9ff' : '#2563eb'};
        }

        .logo-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar.transparent .logo-text {
          -webkit-text-fill-color: white;
        }

        .navbar-menu.desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .navbar-link {
          text-decoration: none;
          font-weight: 500;
          color: ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.9)' : '#374151'};
          transition: color 0.3s ease;
          position: relative;
        }

        .navbar-link:hover,
        .navbar-link.active {
          color: ${shouldBeTransparent ? 'white' : '#3b82f6'};
        }

        .navbar-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: ${shouldBeTransparent ? 'white' : '#3b82f6'};
          border-radius: 1px;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.3)' : '#e5e7eb'};
          border-top: 2px solid ${shouldBeTransparent ? 'white' : '#3b82f6'};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s;
          color: ${shouldBeTransparent ? 'white' : '#374151'};
        }

        .user-button:hover {
          background: ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.1)' : '#f9fafb'};
        }

        .user-avatar {
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'};
          color: ${shouldBeTransparent ? 'white' : '#6b7280'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-name {
          font-weight: 500;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chevron-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          min-width: 200px;
          margin-top: 8px;
          z-index: 1001;
        }

        .dropdown-header {
          padding: 16px;
        }

        .user-display-name {
          display: block;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2px;
        }

        .user-email {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0 8px;
        }

        .dropdown-menu {
          padding: 8px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          color: #374151;
          text-decoration: none;
          transition: background-color 0.2s;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .item-icon {
          font-size: 16px;
          width: 16px;
          text-align: center;
        }

        .item-label {
          font-weight: 500;
        }

        .logout-item {
          color: #ef4444;
        }

        .logout-item:hover {
          background: #fef2f2;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-button {
          background: none;
          border: 1px solid ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.5)' : '#d1d5db'};
          color: ${shouldBeTransparent ? 'white' : '#374151'};
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-button:hover {
          background: ${shouldBeTransparent ? 'rgba(255, 255, 255, 0.1)' : '#f9fafb'};
          border-color: ${shouldBeTransparent ? 'white' : '#9ca3af'};
        }

        .signup-button {
          background: ${shouldBeTransparent ? 'white' : '#3b82f6'};
          color: ${shouldBeTransparent ? '#3b82f6' : 'white'};
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .signup-button:hover {
          background: ${shouldBeTransparent ? '#f8f9ff' : '#2563eb'};
          transform: translateY(-1px);
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger-line {
          width: 24px;
          height: 2px;
          background: ${shouldBeTransparent ? 'white' : '#374151'};
          border-radius: 1px;
          transition: all 0.3s;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        }

        .mobile-menu-link:hover,
        .mobile-menu-link.active {
          color: #3b82f6;
        }

        .mobile-menu-link.logout {
          color: #ef4444;
        }

        .mobile-menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 16px 0;
        }

        .mobile-item-icon {
          font-size: 16px;
          width: 16px;
          text-align: center;
        }

        /* 移动端样式 */
        @media (max-width: 768px) {
          .navbar-menu.desktop {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }

          .auth-buttons {
            display: none;
          }

          .user-name {
            display: none;
          }

          .navbar-container {
            padding: 12px 16px;
          }
        }

        /* 点击外部关闭下拉菜单 */
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}
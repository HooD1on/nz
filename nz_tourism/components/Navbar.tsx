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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    if (transparent) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [transparent])

  const shouldBeTransparent = transparent && !isScrolled && pathname === '/'

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/destinations', label: '目的地' },
    { href: '/packages', label: '旅游套餐' },
    { href: '/blog', label: '旅游博客' },
    { href: '/about', label: '关于我们' },
  ]

  const userMenuItems = [
    { href: '/profile', label: '个人资料', icon: '👤' },
    { href: '/my-bookings', label: '我的预订', icon: '📋' },
    { href: '/wishlist', label: '我的收藏', icon: '❤️' },
    { href: '/settings', label: '设置', icon: '⚙️' },
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

  const navbarClasses = [
    'navbar',
    shouldBeTransparent ? 'navbar--transparent' : 'navbar--solid',
    isScrolled ? 'navbar--scrolled' : '',
    status === 'loading' ? 'navbar--loading' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const mobileMenuClasses = [
    'navbar__mobile-menu',
    isMobileMenuOpen ? 'navbar__mobile-menu--open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const mobileToggleClasses = [
    'navbar__mobile-toggle',
    isMobileMenuOpen ? 'navbar__mobile-toggle--open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleMobileNavItem = (action?: () => void) => {
    setIsMobileMenuOpen(false)
    if (action) {
      action()
    }
  }

  return (
    <nav className={navbarClasses}>
      <div className="navbar__container">
        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-text">WandSky</span>
        </Link>

        <div className="navbar__menu navbar__menu--desktop">
          {navLinks.map((link) => {
            const linkClasses = [
              'navbar__link',
              pathname === link.href ? 'navbar__link--active' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <Link key={link.href} href={link.href} className={linkClasses}>
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="navbar__actions">
          {status === 'loading' ? (
            <div className="navbar__loading-indicator">
              <div className="navbar__loading-spinner" />
            </div>
          ) : session ? (
            <div className="navbar__user-menu">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="navbar__user-button"
                aria-haspopup="menu"
                aria-expanded={showUserDropdown}
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="用户头像"
                    width={32}
                    height={32}
                    className="navbar__user-avatar"
                  />
                ) : (
                  <div className="navbar__user-avatar-placeholder">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="navbar__user-name">{session.user?.name}</span>
                <svg className="navbar__chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <div className="navbar__user-info">
                      <span className="navbar__user-display-name">{session.user?.name}</span>
                      <span className="navbar__user-email">{session.user?.email}</span>
                    </div>
                  </div>

                  <div className="navbar__dropdown-divider" />

                  <div className="navbar__dropdown-menu">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="navbar__dropdown-item"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <span className="navbar__dropdown-icon">{item.icon}</span>
                        <span className="navbar__dropdown-label">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="navbar__dropdown-divider" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="navbar__dropdown-item navbar__dropdown-item--logout"
                  >
                    <span className="navbar__dropdown-icon">🚪</span>
                    <span className="navbar__dropdown-label">退出登录</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth-group">
              <button
                type="button"
                onClick={handleLogin}
                className="navbar__auth-btn navbar__auth-btn--outline"
              >
                登录
              </button>
              <Link href="/auth" className="navbar__auth-btn">
                注册
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={mobileToggleClasses}
            aria-expanded={isMobileMenuOpen}
            aria-label="切换导航菜单"
          >
            <span className="navbar__mobile-toggle-line" />
            <span className="navbar__mobile-toggle-line" />
            <span className="navbar__mobile-toggle-line" />
          </button>
        </div>
      </div>

      <div className={mobileMenuClasses}>
        <div className="navbar__mobile-content">
          {navLinks.map((link) => {
            const mobileLinkClasses = [
              'navbar__mobile-link',
              pathname === link.href ? 'navbar__mobile-link--active' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <Link
                key={link.href}
                href={link.href}
                className={mobileLinkClasses}
                onClick={() => handleMobileNavItem()}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="navbar__mobile-divider" />

          {session ? (
            <>
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="navbar__mobile-link"
                  onClick={() => handleMobileNavItem(() => setShowUserDropdown(false))}
                >
                  <span className="navbar__mobile-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => handleMobileNavItem(handleSignOut)}
                className="navbar__mobile-link navbar__mobile-link--logout"
              >
                <span className="navbar__mobile-icon">🚪</span>
                退出登录
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleMobileNavItem(handleLogin)}
                className="navbar__mobile-link"
              >
                登录
              </button>
              <Link
                href="/auth"
                className="navbar__mobile-link"
                onClick={() => handleMobileNavItem()}
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * 导航处理组件 - 专门处理导航栏样式状态
 * 该组件不渲染任何UI，只负责处理导航状态
 */
export default function NavigationHandler() {
  const pathname = usePathname();
  
  // 检测路径变化并设置适当的样式
  useEffect(() => {
    // 如果是首页，设置首页标识
    if (pathname === '/' || pathname === '') {
      document.documentElement.setAttribute('data-homepage', 'true');
    } else {
      // 否则移除首页标识
      document.documentElement.removeAttribute('data-homepage');
    }
  }, [pathname]);
  
  // 处理浏览器返回和页面缓存
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const currentPath = window.location.pathname;
        // 根据当前路径设置样式
        if (currentPath === '/' || currentPath === '') {
          document.documentElement.setAttribute('data-homepage', 'true');
        } else {
          document.documentElement.removeAttribute('data-homepage');
        }
      }
    };
    
    // 处理浏览器返回按钮事件
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      // 根据当前路径设置样式
      if (currentPath === '/' || currentPath === '') {
        document.documentElement.setAttribute('data-homepage', 'true');
      } else {
        document.documentElement.removeAttribute('data-homepage');
      }
    };
    
    // 直接设置初始状态（无需等待React）
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      document.documentElement.setAttribute('data-homepage', 'true');
    } else {
      document.documentElement.removeAttribute('data-homepage');
    }
    
    // 添加事件监听
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    
    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 页面重新可见时检查路径
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') {
          document.documentElement.setAttribute('data-homepage', 'true');
        } else {
          document.documentElement.removeAttribute('data-homepage');
        }
      }
    });
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', () => {});
    };
  }, []);
  
  // 不渲染任何内容
  return null;
} 
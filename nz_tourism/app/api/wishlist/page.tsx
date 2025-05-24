'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('收藏页面加载，状态:', status);
    
    if (status === 'unauthenticated') {
      router.push('/auth?message=login-required-wishlist');
      return;
    }

    if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid #3498db', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>检查登录状态...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* 简单的导航栏 */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 0', 
        borderBottom: '1px solid #eee',
        marginBottom: '40px'
      }}>
        <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
          WandSky
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#666' }}>首页</Link>
          <Link href="/destinations" style={{ textDecoration: 'none', color: '#666' }}>目的地</Link>
          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>收藏</span>
          <div style={{ 
            background: '#2563eb', 
            color: 'white', 
            padding: '8px 12px', 
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {session?.user?.name || 'DH'}
          </div>
        </div>
      </header>

      {/* 页面内容 */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#1f2937' }}>
            我的收藏
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            您收藏的目的地和旅行计划
          </p>
        </div>

        {/* 成功状态指示 */}
        <div style={{ 
          background: '#dcfce7', 
          border: '1px solid #86efac', 
          borderRadius: '8px', 
          padding: '16px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>✅</span>
          <div>
            <strong style={{ color: '#166534' }}>收藏页面加载成功！</strong>
            <p style={{ margin: '5px 0 0 0', color: '#15803d', fontSize: '14px' }}>
              路由正常工作，用户已登录 ({session?.user?.email})
            </p>
          </div>
        </div>

        {/* 测试收藏项目 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            {
              id: 1,
              title: '皇后镇',
              location: '新西兰南岛',
              price: '¥2,500',
              rating: '4.8',
              image: '🏔️'
            },
            {
              id: 2,
              title: '米尔福德峡湾',
              location: '新西兰南岛',
              price: '¥1,800',
              rating: '4.9',
              image: '🌊'
            },
            {
              id: 3,
              title: '霍比屯',
              location: '新西兰北岛',
              price: '¥800',
              rating: '4.7',
              image: '🏠'
            }
          ].map(item => (
            <div key={item.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                height: '200px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                position: 'relative'
              }}>
                {item.image}
                <button style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}>
                  ❤️
                </button>
              </div>
              
              <div style={{ padding: '16px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  margin: '0 0 8px 0',
                  color: '#1f2937'
                }}>
                  {item.title}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#6b7280', 
                  fontSize: '14px',
                  marginBottom: '12px'
                }}>
                  📍 {item.location}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#fbbf24', marginRight: '4px' }}>⭐</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.rating}</span>
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#2563eb' 
                  }}>
                    {item.price}
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af', 
                  marginTop: '12px' 
                }}>
                  收藏于 {new Date().toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/destinations"
            style={{
              display: 'inline-block',
              background: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            探索更多目的地 →
          </Link>
        </div>

        {/* 开发信息 */}
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0' }}>
            🔧 开发信息
          </h3>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <p><strong>认证状态:</strong> {status}</p>
            <p><strong>用户邮箱:</strong> {session?.user?.email}</p>
            <p><strong>页面路径:</strong> /wishlist</p>
            <p><strong>时间戳:</strong> {new Date().toLocaleString()}</p>
            <p style={{ marginTop: '10px', padding: '10px', background: '#dcfce7', borderRadius: '4px' }}>
              ✅ <strong>成功！</strong> 收藏页面路由正常工作，现在可以集成真实的收藏功能了。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
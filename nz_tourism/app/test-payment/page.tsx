'use client';

import { useState } from 'react';

export default function TestPaymentPage() {
  const [status, setStatus] = useState('ready');

  const testStripeConnection = async () => {
    setStatus('testing');
    
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (!publishableKey) {
        throw new Error('Stripe公钥未配置');
      }
      
      if (!publishableKey.startsWith('pk_test_')) {
        throw new Error('请使用测试环境公钥');
      }
      
      setStatus('success');
      alert(`✅ Stripe配置成功！\n公钥: ${publishableKey.substring(0, 20)}...`);
      
    } catch (error: any) {
      setStatus('error');
      console.error('Stripe配置错误:', error);
      alert(`❌ 配置错误: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto',
      textAlign: 'center' 
    }}>
      <h1>🧪 Stripe支付测试页面</h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0' 
      }}>
        <h3>环境检查</h3>
        <p>点击下方按钮测试Stripe API密钥配置</p>
        
        <button
          onClick={testStripeConnection}
          disabled={status === 'testing'}
          style={{
            padding: '12px 24px',
            background: status === 'success' ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: status === 'testing' ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {status === 'testing' && '🔄 测试中...'}
          {status === 'success' && '✅ 配置成功'}
          {status === 'ready' && '🚀 测试Stripe配置'}
          {status === 'error' && '❌ 重新测试'}
        </button>
      </div>
    </div>
  );
}
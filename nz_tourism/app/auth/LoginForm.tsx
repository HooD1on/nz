'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';


// 定义接口
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 定义API响应接口
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  error?: string;
}

interface LoginFormProps {
  submitError: string;
  setSubmitError: (error: string) => void;
}

export default function LoginForm({ submitError, setSubmitError }: LoginFormProps) {
  const router = useRouter();
  
  // 登录表单状态
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理登录表单更新
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [id.replace('login-', '')]: type === 'checkbox' ? checked : value
    }));
  };


  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };
  
  // 验证登录表单
  const validateLoginForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!loginForm.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!loginForm.password) {
      errors.password = '请输入密码';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 处理登录提交
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginForm.email,
        password: loginForm.password,
        callbackUrl: '/'
      });
  
      if (result?.error) {
        setSubmitError(result.error);
      } else if (result?.ok) {
        router.push(result.url || '/');
      }
    } catch (error) {
      console.error('登录出错:', error);
      setSubmitError('登录过程中发生错误，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2>Welcome Back!</h2>
      <p className="auth-subtitle">Sign in to access your WandSky account</p>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>
      )}
      
      <form className="auth-form" onSubmit={handleLoginSubmit}>
        <div className="form-field">
          <label htmlFor="login-email">Email Address</label>
          <input 
            type="email" 
            id="login-email" 
            placeholder="your@email.com" 
            value={loginForm.email}
            onChange={handleLoginChange}
            required 
          />
          {formErrors.email && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.email}</div>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input 
            type="password" 
            id="login-password" 
            placeholder="Enter your password" 
            value={loginForm.password}
            onChange={handleLoginChange}
            required 
          />
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.password}</div>
          )}
          <Link href="/auth?mode=forgot" className="forgot-password">Forgot Password?</Link>
        </div>
        
        <div className="form-field checkbox">
          <input 
            type="checkbox" 
            id="rememberMe" 
            checked={loginForm.rememberMe}
            onChange={handleLoginChange}
          />
          <label htmlFor="rememberMe">Remember me on this device</label>
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="social-auth">
        <p>Or sign in with</p>
        <div className="social-buttons">
          <button className="social-btn facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </button>
          <button className="social-btn google" onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            Google
          </button>
        </div>
      </div>
    </>
  );
}
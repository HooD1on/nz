'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  submitError: string;
  setSubmitError: (error: string) => void;
  onSuccess?: () => void;
}

export default function LoginForm({ submitError, setSubmitError, onSuccess }: LoginFormProps) {
  const router = useRouter();
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(result.url || '/');
        }
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
      <h2>欢迎回来！</h2>
      <p className="auth-subtitle">登录您的WandSky账户</p>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>
      )}
      
      <form className="auth-form" onSubmit={handleLoginSubmit}>
        <div className="form-field">
          <label htmlFor="login-email">邮箱地址</label>
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
          <label htmlFor="login-password">密码</label>
          <input 
            type="password" 
            id="login-password" 
            placeholder="输入您的密码" 
            value={loginForm.password}
            onChange={handleLoginChange}
            required 
          />
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.password}</div>
          )}
          <Link href="/auth?mode=forgot" className="forgot-password">忘记密码？</Link>
        </div>
        
        <div className="form-field checkbox">
          <input 
            type="checkbox" 
            id="rememberMe" 
            checked={loginForm.rememberMe}
            onChange={handleLoginChange}
          />
          <label htmlFor="rememberMe">在此设备上记住我</label>
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
      
      <div className="social-auth">
        <p>或使用以下方式登录</p>
        <div className="social-buttons">
          <button className="social-btn facebook">
            <span>Facebook</span>
          </button>
          <button className="social-btn google" onClick={handleGoogleSignIn}>
            <span>Google</span>
          </button>
        </div>
      </div>
    </>
  );
}
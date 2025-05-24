'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

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

interface SignupFormProps {
  submitError: string;
  setSubmitError: (error: string) => void;
  setActiveTab: (tab: 'login' | 'signup') => void;
  onSuccess?: () => void;
}

export default function SignupForm({ submitError, setSubmitError, setActiveTab, onSuccess }: SignupFormProps) {
  const router = useRouter();
  
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [id.replace('signup-', '')]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateSignupForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!signupForm.firstName) errors.firstName = '请输入名字';
    if (!signupForm.lastName) errors.lastName = '请输入姓氏';
    
    if (!signupForm.email) {
      errors.email = '请输入邮箱地址';
    } else if (!/\S+@\S+\.\S+/.test(signupForm.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!signupForm.password) {
      errors.password = '请输入密码';
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(signupForm.password)) {
      errors.password = '密码必须至少包含8个字符，1个大写字母，1个数字和1个特殊字符';
    }
    
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = '请确认密码';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不匹配';
    }
    
    if (!signupForm.agreeTerms) {
      errors.agreeTerms = '请同意服务条款和隐私政策';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          email: signupForm.email,
          password: signupForm.password
        }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/');
          }
        } else {
          setActiveTab('login');
        }
      } else {
        setSubmitError(data.error || '注册失败，请稍后再试');
      }
    } catch (error) {
      console.error('注册出错:', error);
      setSubmitError('注册过程中发生错误，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2>创建账户</h2>
      <p className="auth-subtitle">加入WandSky，开始您的冒险之旅</p>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSignupSubmit}>
        <div className="form-field-group">
          <div className="form-field">
            <label htmlFor="first-name">名字</label>
            <input 
              type="text" 
              id="first-name" 
              placeholder="名字" 
              value={signupForm.firstName}
              onChange={handleSignupChange}
              required 
            />
            {formErrors.firstName && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.firstName}</div>
            )}
          </div>
          
          <div className="form-field">
            <label htmlFor="last-name">姓氏</label>
            <input 
              type="text" 
              id="last-name" 
              placeholder="姓氏" 
              value={signupForm.lastName}
              onChange={handleSignupChange}
              required 
            />
            {formErrors.lastName && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.lastName}</div>
            )}
          </div>
        </div>
        
        <div className="form-field">
          <label htmlFor="signup-email">邮箱地址</label>
          <input 
            type="email" 
            id="signup-email" 
            placeholder="your@email.com" 
            value={signupForm.email}
            onChange={handleSignupChange}
            required 
          />
          {formErrors.email && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.email}</div>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="signup-password">密码</label>
          <input 
            type="password" 
            id="signup-password" 
            placeholder="创建密码" 
            value={signupForm.password}
            onChange={handleSignupChange}
            required 
          />
          <p className="password-hint">密码必须至少包含8个字符，1个大写字母，1个数字和1个特殊字符</p>
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.password}</div>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="confirm-password">确认密码</label>
          <input 
            type="password" 
            id="confirm-password" 
            placeholder="确认您的密码" 
            value={signupForm.confirmPassword}
            onChange={handleSignupChange}
            required 
          />
          {formErrors.confirmPassword && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.confirmPassword}</div>
          )}
        </div>
        
        <div className="form-field checkbox">
          <input 
            type="checkbox" 
            id="terms" 
            checked={signupForm.agreeTerms}
            onChange={handleSignupChange}
            required 
          />
          <label htmlFor="terms">
            我同意 <Link href="/terms">服务条款</Link> 和 <Link href="/privacy">隐私政策</Link>
          </label>
          {formErrors.agreeTerms && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.agreeTerms}</div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '创建账户中...' : '创建账户'}
        </button>
      </form>
      
      <div className="social-auth">
        <p>或使用以下方式注册</p>
        <div className="social-buttons">
          <button className="social-btn facebook">
            <span>Facebook</span>
          </button>
          <button className="social-btn google">
            <span>Google</span>
          </button>
        </div>
      </div>
    </>
  );
}
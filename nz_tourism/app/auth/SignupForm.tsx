'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

// 定义接口
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
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

interface SignupFormProps {
  submitError: string;
  setSubmitError: (error: string) => void;
  setActiveTab: (tab: 'login' | 'signup') => void;
}

export default function SignupForm({ submitError, setSubmitError, setActiveTab }: SignupFormProps) {
  const router = useRouter();
  
  // 注册表单状态
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理注册表单更新
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [id.replace('signup-', '')]: type === 'checkbox' ? checked : value
    }));
  };
  
  // 验证注册表单
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
  
  // 处理注册提交
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // 调用注册API
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
        // 注册成功后自动登录
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          // 重定向到首页
          router.push('/');
        } else {
          // 切换到登录标签
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
      <h2>Create an Account</h2>
      <p className="auth-subtitle">Join WandSky and start your adventure</p>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSignupSubmit}>
        <div className="form-field-group">
          <div className="form-field">
            <label htmlFor="first-name">First Name</label>
            <input 
              type="text" 
              id="first-name" 
              placeholder="First name" 
              value={signupForm.firstName}
              onChange={handleSignupChange}
              required 
            />
            {formErrors.firstName && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.firstName}</div>
            )}
          </div>
          
          <div className="form-field">
            <label htmlFor="last-name">Last Name</label>
            <input 
              type="text" 
              id="last-name" 
              placeholder="Last name" 
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
          <label htmlFor="signup-email">Email Address</label>
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
          <label htmlFor="signup-password">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            placeholder="Create a password" 
            value={signupForm.password}
            onChange={handleSignupChange}
            required 
          />
          <p className="password-hint">Must be at least 8 characters with 1 uppercase, 1 number and 1 special character</p>
          {formErrors.password && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.password}</div>
          )}
        </div>
        
        <div className="form-field">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            placeholder="Confirm your password" 
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
            I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
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
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="social-auth">
        <p>Or sign up with</p>
        <div className="social-buttons">
          <button className="social-btn facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </button>
          <button className="social-btn google">
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
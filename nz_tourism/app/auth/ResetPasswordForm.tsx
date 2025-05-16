'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../style/auth.css'
import { signIn } from 'next-auth/react'

interface ResetPasswordFormProps {
  email: string;
  token: string;
  submitError: string;
  setSubmitError: (error: string) => void;
}

export default function ResetPasswordForm({ email, token, submitError, setSubmitError }: ResetPasswordFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  
  useEffect(() => {
    const validateToken = async () => {
      if (email && token) {
        try {
          const response = await fetch(
            `/api/password/validate-token?email=${encodeURIComponent(email)}&token=${token}`
          );
          
          const isValid = await response.json();
          setIsValidToken(isValid);
          
          if (!isValid) {
            setSubmitError('密码重置链接无效或已过期');
          }
        } catch (error) {
          setSubmitError('验证重置链接时出错');
          setIsValidToken(false);
        }
      } else {
        setIsValidToken(false);
        setSubmitError('无效的重置链接');
      }
    };
    
    validateToken();
  }, [email, token, setSubmitError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isLongEnough].filter(Boolean).length;
    
    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitError('两次输入的密码不匹配');
      return;
    }
    
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(formData.newPassword)) {
      setSubmitError('密码必须至少包含8个字符，1个大写字母，1个数字和1个特殊字符');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          token,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('密码已成功重置！');
        
        // 重定向到登录页
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        setSubmitError(data.error || '重置密码时出错，请稍后重试');
      }
    } catch (error) {
      setSubmitError('重置密码时出错，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isValidToken === false) {
    return (
      <>
        <h2>链接无效</h2>
        <p>密码重置链接无效或已过期</p>
        <Link href="/auth/forgot-password" className="auth-button">
          请求新的重置链接
        </Link>
      </>
    );
  }
  
  return (
    <>
      <h2>重置密码</h2>
      <p className="auth-subtitle">请设置您的新密码</p>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{submitError}</div>
      )}
      
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="newPassword">新密码</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="输入新密码"
            required
          />
          {passwordStrength && (
            <div className={`password-strength ${passwordStrength}`}>
              <div className="strength-bar"></div>
              <div className="strength-bar"></div>
              <div className="strength-bar"></div>
              <span className="strength-text">{passwordStrength} 密码</span>
            </div>
          )}
          <div className="password-requirements">
            <p>密码必须包含:</p>
            <ul>
              <li className={formData.newPassword && formData.newPassword.length >= 8 ? 'met' : ''}>
                至少8个字符
              </li>
              <li className={formData.newPassword && /[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                至少1个大写字母
              </li>
              <li className={formData.newPassword && /\d/.test(formData.newPassword) ? 'met' : ''}>
                至少1个数字
              </li>
              <li className={formData.newPassword && /[!@#$%^&*()]/.test(formData.newPassword) ? 'met' : ''}>
                至少1个特殊字符 (!@#$%^&*())
              </li>
            </ul>
          </div>
        </div>
        
        <div className="form-field">
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="再次输入新密码"
            required
          />
        </div>
        
        <button
          type="submit"
          className="auth-button"
          disabled={isSubmitting || isValidToken != true}
        >
          {isSubmitting ? '处理中...' : '重置密码'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/auth">返回登录</Link>
      </div>
    </>
  );
}
'use client'

import { useState, FormEvent } from 'react'

interface PasswordFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function PasswordForm({ onSubmit }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 处理表单输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 验证表单
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = '请输入当前密码';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = '请输入新密码';
    } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(formData.newPassword)) {
      errors.newPassword = '密码必须至少包含8个字符，1个大写字母，1个数字和1个特殊字符';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认新密码';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不匹配';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData.currentPassword, formData.newPassword);
      // 成功后清空表单
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 切换密码可见性
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };
  
  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    if (!password) return '';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isLongEnough].filter(Boolean).length;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };
  
  const passwordStrength = checkPasswordStrength(formData.newPassword);
  
  return (
    <div className="password-form-container">
      <h2>Change Password</h2>
      <p>Update your password to keep your account secure</p>
      
      <form className="password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password*</label>
          <div className="password-input-container">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showCurrentPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {formErrors.currentPassword && (
            <div className="form-error">{formErrors.currentPassword}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">New Password*</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {formData.newPassword && (
            <div className={`password-strength ${passwordStrength}`}>
              <div className="strength-bar"></div>
              <div className="strength-bar"></div>
              <div className="strength-bar"></div>
              <span className="strength-text">{passwordStrength} password</span>
            </div>
          )}
          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li className={formData.newPassword && formData.newPassword.length >= 8 ? 'met' : ''}>
                At least 8 characters
              </li>
              <li className={formData.newPassword && /[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                At least 1 uppercase letter
              </li>
              <li className={formData.newPassword && /\d/.test(formData.newPassword) ? 'met' : ''}>
                At least 1 number
              </li>
              <li className={formData.newPassword && /[!@#$%^&*()]/.test(formData.newPassword) ? 'met' : ''}>
                At least 1 special character (!@#$%^&*())
              </li>
            </ul>
          </div>
          {formErrors.newPassword && (
            <div className="form-error">{formErrors.newPassword}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password*</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className="toggle-password-btn"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <div className="form-error">{formErrors.confirmPassword}</div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
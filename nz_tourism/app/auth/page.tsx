'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import ResetPasswordForm from './ResetPasswordForm'
import '../style/auth.css'
import { signIn } from 'next-auth/react'


export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams?.get('mode') || '';
  const email = searchParams?.get('email') || '';
  const token = searchParams?.get('token') || '';
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [submitError, setSubmitError] = useState('');

  // 如果URL中有模式参数，使用它来决定显示哪个表单
  useEffect(() => {
    if (mode === 'signup') {
      setActiveTab('signup');
    } else if (mode === 'login') {
      setActiveTab('login');
    }
  }, [mode]);

  // 根据模式渲染不同的表单
  const renderContent = () => {
    if (mode === 'forgot') {
      return <ForgotPasswordForm submitError={submitError} setSubmitError={setSubmitError} />;
    } else if (mode === 'reset' && email && token) {
      return <ResetPasswordForm 
        email={email} 
        token={token} 
        submitError={submitError} 
        setSubmitError={setSubmitError} 
      />;
    } else {
      // 默认显示登录/注册表单
      return (
        <>
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => setActiveTab('login')}
            >
              Login
            </div>
            <div 
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </div>
          </div>
          
          {/* 登录表单 */}
          <div className={`auth-form-container ${activeTab === 'login' ? 'active' : ''}`} id="login-form">
            <LoginForm submitError={submitError} setSubmitError={setSubmitError} />
          </div>
          
          {/* 注册表单 */}
          <div className={`auth-form-container ${activeTab === 'signup' ? 'active' : ''}`} id="signup-form">
            <SignupForm submitError={submitError} setSubmitError={setSubmitError} setActiveTab={setActiveTab} />
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Navbar transparent={false} className="auth-navbar" />
      
      <div className="auth-container">
        <div className="auth-card">
          {renderContent()}
        </div>
      </div>
      
      <Footer />
    </>
  );
}
'use client';

import React, { useState } from 'react';
import { MdEmail, MdCheck, MdArrowForward } from 'react-icons/md';
import SectionTitle from '../common/SectionTitle';
import InputField from '../ui/InputField';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('请输入您的电子邮箱');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('请输入有效的电子邮箱');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功处理
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('订阅失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="subscribe-section">
      <div className="subscribe-container">
        <div className="subscribe-content">
          <h3 className="subscribe-title">订阅我们的旅游资讯</h3>
          
          <ul className="benefits-list">
            <li className="benefit-item">
              <MdCheck className="benefit-icon" size={20} />
              <span className="benefit-text">第一时间获取独家优惠和特价套餐</span>
            </li>
            <li className="benefit-item">
              <MdCheck className="benefit-icon" size={20} />
              <span className="benefit-text">接收目的地最新资讯和旅行建议</span>
            </li>
            <li className="benefit-item">
              <MdCheck className="benefit-icon" size={20} />
              <span className="benefit-text">了解季节性活动和特色体验</span>
            </li>
          </ul>
          
          {submitted ? (
            <div className="subscribe-success">
              <MdCheck size={48} className="success-icon" />
              <h4 className="success-title">订阅成功！</h4>
              <p className="success-message">
                感谢您的订阅，我们会定期发送新西兰旅游最新资讯给您。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="subscribe-form">
              <div className="input-wrapper">
                <MdEmail className="input-icon" size={20} />
                <input
                  type="email"
                  className="subscribe-input"
                  placeholder="您的电子邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="subscribe-button"
                disabled={loading}
              >
                {loading ? '提交中...' : '订阅'}
                {!loading && <MdArrowForward size={20} />}
              </button>
            </form>
          )}
          
          {error && <p className="subscribe-error">{error}</p>}
          
          <p className="subscribe-note">
            我们重视您的隐私，您可以随时取消订阅。
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscribe; 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import PreferencesForm from './PreferencesForm'
import '../style/profile.css'
import Navbar from '../../components/Navbar'
import { useSession } from 'next-auth/react'

// 用户个人资料接口
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  profileImage?: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    travelPreferences: string[];
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 获取用户资料数据
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 检查用户是否已登录
        if (status === 'unauthenticated') {
          router.push('/auth');
          return;
        }
        
        if (status === 'loading') {
          return; // 等待会话加载完成
        }

        // 从API获取用户资料
        const response = await fetch('/api/user/profile');

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setStatusMessage({ type: 'error', text: 'Failed to load profile data. Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, status]);

  // 处理资料更新
  const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
    try {
      setStatusMessage(null);
      
      // 使用API路由
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      });
  
      // 获取完整的响应信息
      console.log('响应状态:', response.status);
      
      const responseText = await response.text();
      console.log('响应体原始文本:', responseText);
      
      if (!response.ok) {
        throw new Error(`请求失败 (${response.status}): ${responseText}`);
      }
  
      // 尝试解析JSON响应
      let updatedData;
      try {
        updatedData = JSON.parse(responseText);
      } catch (e) {
        console.error('无法解析JSON响应:', e);
        throw new Error('服务器返回了无效的响应格式');
      }
      
      setUser(prevUser => ({ ...prevUser!, ...updatedData }));
      setStatusMessage({ type: 'success', text: '个人资料更新成功！' });
      
    } catch (error: any) {
      console.error('更新资料时出错:', error);
      setStatusMessage({ type: 'error', text: `更新失败: ${error.message}` });
    }
  };

  // 处理密码更改
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      setStatusMessage(null);
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      setStatusMessage({ type: 'error', text: error.message || 'Failed to change password. Please try again.' });
    }
  };

  // 处理偏好设置更新
  const handlePreferencesUpdate = async (preferences: UserProfile['preferences']) => {
    try {
      setStatusMessage(null);
      
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences })
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedData = await response.json();
      setUser(prevUser => ({ ...prevUser!, preferences: updatedData.preferences }));
      setStatusMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      console.error('Error updating preferences:', error);
      setStatusMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Unable to load profile</h2>
          <p>There was a problem loading your profile. Please try again later.</p>
          <button onClick={() => router.push('/')}>Return to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar transparent={false} />
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {user.profileImage ? (
          <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
        )}
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{user.email}</p>
      </div>

      {statusMessage && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <div className="profile-tabs">
        <div 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Personal Information
        </div>
        <div 
          className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </div>
        <div 
          className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <ProfileForm user={user} onSubmit={handleProfileUpdate} />
        )}
        
        {activeTab === 'password' && (
          <PasswordForm onSubmit={handlePasswordChange} />
        )}
        
        {activeTab === 'preferences' && (
          <PreferencesForm 
            preferences={user.preferences || { notifications: true, newsletter: false, travelPreferences: [] }} 
            onSubmit={handlePreferencesUpdate} 
          />
        )}
      </div>
    </div>
    </>
  );
}
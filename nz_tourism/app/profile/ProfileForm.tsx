'use client'

import { useState, FormEvent } from 'react'

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
}

interface ProfileFormProps {
  user: UserProfile;
  onSubmit: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export default function ProfileForm({ user, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    bio: user.bio || ''
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user.profileImage || null);
  
  // 处理表单输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = '请输入名字';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = '请输入姓氏';
    }
    
    if (!formData.email.trim()) {
      errors.email = '请输入电子邮箱';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '请输入有效的电子邮箱地址';
    }
    
    // 如果有电话号码，则验证格式
    if (formData.phone && !/^\+?[0-9\s\-()]{8,20}$/.test(formData.phone)) {
      errors.phone = '请输入有效的电话号码';
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
      // 确保包含所有必需字段，即使未更改
      const completeUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        // 确保这些字段永远不为null，而是使用空字符串
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "",
        phone: formData.phone || "",
        bio: formData.bio || "",
        profileImage: profileImagePreview || ""
      };
      
      console.log('发送完整更新:', completeUpdate);
      await onSubmit(completeUpdate);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 移除个人资料图片
  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };
  
  return (
    <div className="profile-form-container">
      <h2>Personal Information</h2>
      <p>Update your personal details</p>
      
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Profile Photo</h3>
          <div className="profile-image-upload">
            {profileImagePreview ? (
              <div className="image-preview-container">
                <img 
                  src={profileImagePreview} 
                  alt="Profile preview" 
                  className="image-preview" 
                />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <p>Upload your photo</p>
              </div>
            )}
            <input 
              type="file" 
              id="profile-image" 
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
            <label htmlFor="profile-image" className="upload-btn">
              Choose Photo
            </label>
          </div>
        </div>
      
        <div className="form-section">
          <h3>Basic Info</h3>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              {formErrors.firstName && (
                <div className="form-error">{formErrors.firstName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              {formErrors.lastName && (
                <div className="form-error">{formErrors.lastName}</div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {formErrors.email && (
              <div className="form-error">{formErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
            />
            {formErrors.phone && (
              <div className="form-error">{formErrors.phone}</div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Address</h3>
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>About Me</h3>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us a bit about yourself..."
            />
          </div>
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
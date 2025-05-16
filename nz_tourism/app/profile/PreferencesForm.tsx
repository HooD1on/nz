'use client'

import { useState, FormEvent } from 'react'

interface Preferences {
  notifications: boolean;
  newsletter: boolean;
  travelPreferences: string[];
}

interface PreferencesFormProps {
  preferences: Preferences;
  onSubmit: (preferences: Preferences) => Promise<void>;
}

// 可选的旅行偏好选项
const TRAVEL_PREFERENCE_OPTIONS = [
  'Beach', 'Mountains', 'City', 'Countryside',
  'Adventure', 'Relaxation', 'Cultural', 'Historical',
  'Food & Wine', 'Shopping', 'Nightlife', 'Family Friendly',
  'Eco Tourism', 'Luxury', 'Budget', 'Solo Travel'
];

export default function PreferencesForm({ preferences, onSubmit }: PreferencesFormProps) {
  const [formData, setFormData] = useState<Preferences>({
    notifications: preferences.notifications,
    newsletter: preferences.newsletter,
    travelPreferences: [...preferences.travelPreferences]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理复选框变更
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // 处理旅行偏好选择
  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => {
      const currentPreferences = [...prev.travelPreferences];
      
      if (currentPreferences.includes(preference)) {
        // 移除偏好
        return {
          ...prev,
          travelPreferences: currentPreferences.filter(p => p !== preference)
        };
      } else {
        // 添加偏好
        return {
          ...prev,
          travelPreferences: [...currentPreferences, preference]
        };
      }
    });
  };
  
  // 处理表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // 按照API期望的格式构造数据
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="preferences-form-container">
      <h2>Your Preferences</h2>
      <p>Customize your travel experience and communication preferences</p>
      
      <form className="preferences-form" onSubmit={handleSubmit}>
        <div className="preferences-section">
          <h3>Communication Preferences</h3>
          
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="notifications">
                <strong>Activity Notifications</strong>
                <p>Receive notifications about booking updates, travel alerts, and account activity</p>
              </label>
            </div>
            
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="newsletter">
                <strong>Newsletter</strong>
                <p>Subscribe to our newsletter for travel inspiration, tips, and exclusive offers</p>
              </label>
            </div>
          </div>
        </div>
        
        <div className="preferences-section">
          <h3>Travel Preferences</h3>
          <p>Select your travel interests to help us personalize recommendations for you</p>
          
          <div className="travel-preferences">
            {TRAVEL_PREFERENCE_OPTIONS.map((preference) => (
              <div 
                key={preference}
                className={`preference-tag ${formData.travelPreferences.includes(preference) ? 'selected' : ''}`}
                onClick={() => handlePreferenceToggle(preference)}
              >
                <input
                  type="checkbox"
                  id={`pref-${preference}`}
                  name={preference}
                  checked={formData.travelPreferences.includes(preference)}
                  readOnly
                />
                <label htmlFor={`pref-${preference}`}>{preference}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
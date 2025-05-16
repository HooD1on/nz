'use client';

import { useState } from 'react';

interface InfoItem {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface DestinationInfoProps {
  weather: string;
  transportation: string;
  food: string;
  accommodation: string;
  customs: string;
}

const DestinationInfo: React.FC<DestinationInfoProps> = ({
  weather,
  transportation,
  food,
  accommodation,
  customs
}) => {
  const [activeTab, setActiveTab] = useState('weather');

  const infoTabs: Record<string, { title: string; icon: React.ReactNode }> = {
    weather: {
      title: '天气与气候',
      icon: (
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    transportation: {
      title: '交通出行',
      icon: (
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    food: {
      title: '当地美食',
      icon: (
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    accommodation: {
      title: '住宿推荐',
      icon: (
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    customs: {
      title: '风俗礼仪',
      icon: (
        <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'weather':
        return weather;
      case 'transportation':
        return transportation;
      case 'food':
        return food;
      case 'accommodation':
        return accommodation;
      case 'customs':
        return customs;
      default:
        return '';
    }
  };

  return (
    <div className="destination-info">
      <h2 className="section-title">实用信息</h2>
      
      <div className="info-tabs">
        <div className="info-tab-buttons">
          {Object.entries(infoTabs).map(([key, { title, icon }]) => (
            <button
              key={key}
              className={`info-tab-button ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {icon}
              <span>{title}</span>
            </button>
          ))}
        </div>
        
        <div className="info-tab-content">
          <div className="info-content">
            <h3 className="info-content-title">{infoTabs[activeTab].title}</h3>
            <div className="info-content-body">
              <p>{getActiveContent()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationInfo; 
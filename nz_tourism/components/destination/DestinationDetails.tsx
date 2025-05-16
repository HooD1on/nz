'use client';

import { useState } from 'react';

interface DestinationDetailsProps {
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  weather: string;
  language: string;
  currency: string;
  timeZone: string;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  description,
  highlights,
  bestTimeToVisit,
  weather,
  language,
  currency,
  timeZone
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="tab-container">
      <div className="tab-content">
        {/* 标签页导航 */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`tab-button ${activeTab === 'highlights' ? 'active' : ''}`}
          >
            特色
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          >
            实用信息
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="tab-panel">
          {activeTab === 'overview' && (
            <div className="content-section">
              <h2 className="section-title">目的地介绍</h2>
              <p className="section-text">{description}</p>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="content-section">
              <h2 className="section-title">目的地特色</h2>
              <ul className="highlights-list">
                {highlights.map((highlight, index) => (
                  <li key={index} className="highlight-item">
                    <svg className="highlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="section-text">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="content-section">
              <div className="info-grid">
                <div className="info-item">
                  <h3 className="info-title">最佳旅行时间</h3>
                  <p className="info-text">{bestTimeToVisit}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-title">天气</h3>
                  <p className="info-text">{weather}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-title">语言</h3>
                  <p className="info-text">{language}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-title">货币</h3>
                  <p className="info-text">{currency}</p>
                </div>
                <div className="info-item">
                  <h3 className="info-title">时区</h3>
                  <p className="info-text">{timeZone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails; 
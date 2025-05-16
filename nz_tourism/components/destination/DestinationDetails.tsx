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
    <div className="details-container">
      <div className="details-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`details-tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          概览
        </button>
        <button
          onClick={() => setActiveTab('highlights')}
          className={`details-tab ${activeTab === 'highlights' ? 'active' : ''}`}
        >
          特色
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`details-tab ${activeTab === 'info' ? 'active' : ''}`}
        >
          实用信息
        </button>
      </div>

      <div className="details-content">
        {activeTab === 'overview' && (
          <div className="details-overview">
            <p className="details-description">{description}</p>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="details-highlights">
            <ul className="highlights-list">
              {highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">
                  <div className="highlight-icon-container">
                    <svg className="highlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="details-info">
            <div className="info-card">
              <div className="info-icon-container">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>最佳旅行时间</h3>
              <p>{bestTimeToVisit}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon-container">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3>天气</h3>
              <p>{weather}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon-container">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3>语言</h3>
              <p>{language}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon-container">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>货币</h3>
              <p>{currency}</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon-container">
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>时区</h3>
              <p>{timeZone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetails; 
'use client';

import { useState, useEffect } from 'react';

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
  destinationId: string; // 新增属性，用于API调用
}

const DestinationInfo: React.FC<DestinationInfoProps> = ({
  weather: staticWeather,
  transportation,
  food,
  accommodation,
  customs,
  destinationId
}) => {
  const [activeTab, setActiveTab] = useState('weather');
  const [weather, setWeather] = useState(staticWeather);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 获取实时天气数据
  useEffect(() => {
    // 只在天气标签激活时获取数据
    if (activeTab !== 'weather') return;

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        console.log(`获取目的地天气数据: ${destinationId}`);
        const response = await fetch(`/api/weather/${destinationId}`);
        
        if (!response.ok) {
          throw new Error(`天气API返回状态码: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        // 构建新的天气描述
        let dynamicWeather = '';
        
        if (data.current) {
          dynamicWeather = `实时天气：${data.current.condition.text}，温度：${data.current.temp_c}°C，体感温度：${data.current.feelslike_c}°C，风速：${data.current.wind_kph}km/h，湿度：${data.current.humidity}%。\n\n`;
          
          // 更新最后更新时间
          const now = new Date();
          setLastUpdated(now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }
        
        // 结合动态天气和静态季节描述
        setWeather(dynamicWeather + staticWeather);
        console.log('天气数据更新成功');
      } catch (err) {
        console.error('获取天气数据失败:', err);
        setError('获取实时天气数据失败，显示静态信息');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
    
    // 设置定时刷新 (每4小时)
    const REFRESH_INTERVAL = 4 * 60 * 60 * 1000; // 4小时，单位毫秒
    const timer = setInterval(fetchWeatherData, REFRESH_INTERVAL);
    
    return () => clearInterval(timer);
  }, [destinationId, activeTab, staticWeather]);

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
        return (
          <>
            {isLoading && <p className="loading-indicator">正在获取最新天气数据...</p>}
            {error && <p className="error-message">{error}</p>}
            <div>
              {weather.split('\n\n').map((paragraph, index) => (
                <p key={index} className="weather-paragraph">{paragraph}</p>
              ))}
              {lastUpdated && (
                <p className="last-updated">
                  <small>最后更新: {lastUpdated}</small>
                </p>
              )}
            </div>
          </>
        );
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
              {getActiveContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-indicator {
          color: #666;
          font-style: italic;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .error-message {
          color: #e53e3e;
          padding: 10px;
          background-color: #fff5f5;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .weather-paragraph {
          margin-bottom: 16px;
          line-height: 1.6;
        }
        
        .last-updated {
          font-size: 0.8rem;
          color: #718096;
          text-align: right;
          margin-top: 16px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default DestinationInfo;
'use client';

import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface DestinationFilterProps {
  onFilterChange: (filters: {
    region: string;
    activityType: string;
    season: string;
    searchQuery: string;
  }) => void;
}

const DestinationFilter: React.FC<DestinationFilterProps> = ({ onFilterChange }) => {
  const [region, setRegion] = useState('');
  const [activityType, setActivityType] = useState('');
  const [season, setSeason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const regionOptions: FilterOption[] = [
    { value: '', label: '所有区域' },
    { value: 'north-island', label: '北岛' },
    { value: 'south-island', label: '南岛' }
  ];

  const activityOptions: FilterOption[] = [
    { value: '', label: '所有活动' },
    { value: 'nature', label: '自然风光' },
    { value: 'culture', label: '文化体验' },
    { value: 'adventure', label: '冒险活动' },
    { value: 'food-wine', label: '美食与葡萄酒' }
  ];

  const seasonOptions: FilterOption[] = [
    { value: '', label: '所有季节' },
    { value: 'spring', label: '春季 (9-11月)' },
    { value: 'summer', label: '夏季 (12-2月)' },
    { value: 'autumn', label: '秋季 (3-5月)' },
    { value: 'winter', label: '冬季 (6-8月)' }
  ];

  const handleFilterChange = (
    filterType: 'region' | 'activityType' | 'season',
    value: string
  ) => {
    switch (filterType) {
      case 'region':
        setRegion(value);
        break;
      case 'activityType':
        setActivityType(value);
        break;
      case 'season':
        setSeason(value);
        break;
    }

    onFilterChange({
      region: filterType === 'region' ? value : region,
      activityType: filterType === 'activityType' ? value : activityType,
      season: filterType === 'season' ? value : season,
      searchQuery
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      region,
      activityType,
      season,
      searchQuery
    });
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3 className="filter-title">筛选目的地</h3>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="region" className="filter-label">区域</label>
            <select
              id="region"
              className="filter-select"
              value={region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="activityType" className="filter-label">活动类型</label>
            <select
              id="activityType"
              className="filter-select"
              value={activityType}
              onChange={(e) => handleFilterChange('activityType', e.target.value)}
            >
              {activityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="season" className="filter-label">最佳季节</label>
            <select
              id="season"
              className="filter-select"
              value={season}
              onChange={(e) => handleFilterChange('season', e.target.value)}
            >
              {seasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="搜索目的地..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </button>
        </form>
      </div>
    </div>
  );
};

export default DestinationFilter; 
'use client';

import { useState } from 'react';
import styles from './DestinationFilter.module.css';
import TailwindModuleSearchBar from '../TailwindModuleSearchBar';

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

const DestinationFilterModule: React.FC<DestinationFilterProps> = ({ onFilterChange }) => {
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onFilterChange({
      region,
      activityType,
      season,
      searchQuery: query
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>筛选目的地</h3>
        
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="region" className={styles.filterLabel}>区域</label>
            <select
              id="region"
              className={styles.filterSelect}
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
          
          <div className={styles.filterGroup}>
            <label htmlFor="activityType" className={styles.filterLabel}>活动类型</label>
            <select
              id="activityType"
              className={styles.filterSelect}
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
          
          <div className={styles.filterGroup}>
            <label htmlFor="season" className={styles.filterLabel}>最佳季节</label>
            <select
              id="season"
              className={styles.filterSelect}
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
      
      <div className={styles.searchSection}>
        <TailwindModuleSearchBar
          onSearch={handleSearch}
          placeholder="搜索目的地..."
          buttonText="搜索"
        />
      </div>
    </div>
  );
};

export default DestinationFilterModule; 
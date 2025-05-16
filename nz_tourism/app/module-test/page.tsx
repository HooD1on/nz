'use client';

import React from 'react';
import HeroModule from '../../components/home/HeroModule';
import DestinationFilterModule from '../../components/destination/DestinationFilterModule';

export default function ModuleTestPage() {
  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <div className="module-test-page">
      <h1 style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f0f0f0', 
        margin: 0, 
        fontSize: '24px'
      }}>
        CSS 模块化组件测试
      </h1>
      
      <div style={{ margin: '20px 0', padding: '0 20px' }}>
        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          1. 主页 Hero 模块
        </h2>
        <HeroModule />
      </div>
      
      <div style={{ margin: '40px 0', padding: '0 20px' }}>
        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          2. 目的地筛选器模块
        </h2>
        <DestinationFilterModule onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
} 
'use client';

import React from 'react';
import TailwindModuleSearchBar from '../../components/TailwindModuleSearchBar';
import TailwindPrefixSearchBar from '../../components/TailwindPrefixSearchBar';
import StandaloneSearchBar from '../../components/StandaloneSearchBar';

export default function TailwindTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Tailwind CSS 解决方案测试</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">基础组件测试</h2>
        <p className="text-gray-600 mb-4">
          以下组件使用特殊类名前缀，避免样式冲突
        </p>
        <div className="flex space-x-4 mb-6">
          <button className="tw-button-primary">
            主要按钮
          </button>
          <button className="tw-button-secondary">
            次要按钮
          </button>
          <button className="tw-button-outline">
            描边按钮
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="tw-card">
            <h3 className="tw-card-title">卡片 1</h3>
            <p className="tw-card-text">使用Tailwind前缀类创建的卡片</p>
          </div>
          <div className="tw-card">
            <h3 className="tw-card-title">卡片 2</h3>
            <p className="tw-card-text">使用Tailwind前缀类创建的卡片</p>
          </div>
          <div className="tw-card">
            <h3 className="tw-card-title">卡片 3</h3>
            <p className="tw-card-text">使用Tailwind前缀类创建的卡片</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">方案1：CSS模块</h2>
        <p className="text-gray-600 mb-4">
          使用CSS模块隔离样式，避免全局样式冲突
        </p>
        <TailwindModuleSearchBar 
          placeholder="使用CSS模块的搜索栏"
          buttonText="搜索"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">方案2：前缀命名</h2>
        <p className="text-gray-600 mb-4">
          使用tw-前缀命名避免样式冲突
        </p>
        <TailwindPrefixSearchBar 
          placeholder="使用前缀命名的搜索栏"
          buttonText="搜索"
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">方案3：内联样式</h2>
        <p className="text-gray-600 mb-4">
          完全使用内联样式，不依赖CSS框架
        </p>
        <StandaloneSearchBar 
          placeholder="使用内联样式的搜索栏"
          buttonText="搜索"
        />
      </div>
    </div>
  );
} 
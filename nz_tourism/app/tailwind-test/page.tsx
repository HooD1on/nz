'use client';

import React from 'react';
import TailwindSearchBar from '../../components/TailwindSearchBar';
import PureTailwindSearch from '../../components/PureTailwindSearch';
import ForcedTailwindSearchBar from '../../components/ForcedTailwindSearchBar';
import StandaloneSearchBar from '../../components/StandaloneSearchBar';

export default function TailwindTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Tailwind CSS 测试页面</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tailwind 样式测试</h2>
        <p className="text-gray-600 mb-4">
          这个页面用于测试Tailwind CSS是否正确工作。下面的元素使用了纯Tailwind类。
        </p>
        <div className="flex space-x-4 mb-6">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            蓝色按钮
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            绿色按钮
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            红色按钮
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-gray-900">卡片 1</h3>
            <p className="text-gray-500">使用Tailwind创建的卡片</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-gray-900">卡片 2</h3>
            <p className="text-gray-500">使用Tailwind创建的卡片</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-gray-900">卡片 3</h3>
            <p className="text-gray-500">使用Tailwind创建的卡片</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">复杂搜索组件测试</h2>
        <p className="text-gray-600 mb-4">
          下面是我们使用Tailwind CSS创建的搜索组件：
        </p>
        <TailwindSearchBar 
          onSearch={(query) => alert(`搜索: ${query}`)} 
          placeholder="输入任何内容进行测试..."
          buttonText="测试搜索"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">超简单搜索组件测试</h2>
        <p className="text-gray-600 mb-4">
          这是最简单的纯Tailwind搜索组件：
        </p>
        <PureTailwindSearch />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">行内样式搜索组件测试</h2>
        <p className="text-gray-600 mb-4">
          这是使用行内样式的搜索组件（不依赖Tailwind）：
        </p>
        <ForcedTailwindSearchBar placeholder="使用行内样式..." />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">独立搜索组件测试</h2>
        <p className="text-gray-600 mb-4">
          这是完全独立的搜索组件，使用纯内联样式，不依赖任何CSS框架：
        </p>
        <StandaloneSearchBar placeholder="完全独立的搜索..." buttonText="搜索" />
      </div>
    </div>
  );
} 
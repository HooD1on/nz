'use client';

import React, { useState } from 'react';
import TailwindSearchBar from '../../components/TailwindSearchBar';
import TailwindModuleSearchBar from '../../components/TailwindModuleSearchBar';
import TailwindDestinationCard from '../../components/TailwindDestinationCard';

// 使用占位图的假数据
const sampleDestinations = [
  {
    title: "皇后镇",
    description: "新西兰最受欢迎的旅游目的地，以其壮丽的自然风光和丰富的户外活动而闻名。被誉为'冒险之都'，提供跳伞、高空弹跳、喷射快艇等刺激活动。",
    imageUrl: "https://images.unsplash.com/photo-1591121213125-ece9be662c17?q=80&w=500",
    price: 1299,
    rating: 4.8,
    location: "新西兰南岛",
    slug: "queenstown"
  },
  {
    title: "罗托鲁瓦",
    description: "体验毛利文化和地热奇观的最佳地点，享受温泉和自然美景。这里的地热活动非常活跃，有间歇泉、泥浆池和彩色地热湖泊。",
    imageUrl: "https://images.unsplash.com/photo-1579521980448-75a33769a1ed?q=80&w=500",
    price: 899,
    rating: 4.6,
    location: "新西兰北岛",
    slug: "rotorua"
  },
  {
    title: "米尔福德峡湾",
    description: "世界第八大自然奇观，壮丽的峡湾和原始自然风光。被《鲁道夫·古德利比》誉为'世界第八大奇迹'，峭壁、瀑布和原始雨林令人叹为观止。",
    imageUrl: "https://images.unsplash.com/photo-1624138142753-713645a41ef9?q=80&w=500",
    price: 1499,
    rating: 4.9,
    location: "新西兰南岛",
    slug: "milford-sound"
  }
];

export default function TailwindSearchTestPage() {
  const [searchResult1, setSearchResult1] = useState<string | null>(null);
  const [searchResult2, setSearchResult2] = useState<string | null>(null);

  const handleSearch1 = (query: string) => {
    setSearchResult1(`您搜索了: ${query}`);
  };

  const handleSearch2 = (query: string) => {
    setSearchResult2(`您搜索了: ${query}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Tailwind CSS 组件测试
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            1. 纯 Tailwind CSS 搜索栏
          </h2>
          <p className="text-gray-600 mb-4">
            使用Tailwind CSS实用类直接样式化的搜索栏组件，不依赖CSS模块。
          </p>
          <div className="mb-4">
            <TailwindSearchBar 
              onSearch={handleSearch1}
              placeholder="输入搜索内容..."
              buttonText="搜索"
            />
          </div>
          {searchResult1 && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
              {searchResult1}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            2. CSS 模块化搜索栏（对比）
          </h2>
          <p className="text-gray-600 mb-4">
            使用CSS模块实现的搜索栏组件，样式隔离不会与其他组件冲突。
          </p>
          <div className="mb-4">
            <TailwindModuleSearchBar 
              onSearch={handleSearch2}
              placeholder="输入搜索内容..."
              buttonText="搜索"
            />
          </div>
          {searchResult2 && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
              {searchResult2}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            3. Tailwind CSS 目的地卡片
          </h2>
          <p className="text-gray-600 mb-4">
            使用Tailwind CSS实现的复杂目的地卡片组件，展示灵活的布局和交互效果。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleDestinations.map((destination, index) => (
              <TailwindDestinationCard
                key={index}
                {...destination}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-yellow-800">
          <h3 className="font-semibold mb-2">Tailwind CSS使用说明：</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>直接在JSX元素上使用Tailwind类名，适合快速开发</li>
            <li>CSS模块方案适合复杂组件和避免样式冲突</li>
            <li>现在您已经解决了样式冲突问题，可以在项目中自由使用这两种方案</li>
            <li>对于新组件，推荐使用纯Tailwind CSS方式开发，更快速灵活</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
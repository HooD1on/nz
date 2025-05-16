import React from 'react';
import Link from 'next/link';

interface DestinationCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  location: string;
  slug: string;
}

export default function TailwindDestinationCard({
  title,
  description,
  imageUrl,
  price,
  rating,
  location,
  slug
}: DestinationCardProps) {
  return (
    <Link 
      href={`/destinations/${slug}`}
      className="group flex flex-col overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* 图片容器 */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* 价格标签 */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold py-1 px-3 rounded-full shadow-md">
          ¥{price}
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex flex-col flex-grow p-5">
        {/* 标题和评分 */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
            {title}
          </h3>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        {/* 位置信息 */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
        
        {/* 描述 - 替换line-clamp-3为普通溢出处理 */}
        <p className="text-sm text-gray-600 mb-4 overflow-hidden h-12">
          {description.length > 70 ? `${description.substring(0, 70)}...` : description}
        </p>
        
        {/* 查看按钮 */}
        <div className="mt-auto">
          <div className="inline-block text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200">
            了解更多
            <svg className="w-4 h-4 inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 
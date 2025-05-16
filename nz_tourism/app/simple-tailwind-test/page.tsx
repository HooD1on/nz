'use client';

import React from 'react';

export default function SimpleTailwindTest() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          简单的Tailwind CSS测试
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            基础按钮样式
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              基础按钮
            </button>
            
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              圆角按钮
            </button>
            
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full">
              胶囊按钮
            </button>
            
            <button className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded">
              描边按钮
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            卡片与布局
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-2">信息卡片</h3>
              <p className="text-sm text-blue-600">这是一个简单的信息展示卡片，使用Tailwind的颜色和间距。</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-700 mb-2">成功卡片</h3>
              <p className="text-sm text-green-600">这是一个成功状态的卡片，展示操作已完成。</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h3 className="font-medium text-yellow-700 mb-2">警告卡片</h3>
              <p className="text-sm text-yellow-600">这是一个警告提示卡片，引起用户注意。</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="font-medium text-red-700 mb-2">错误卡片</h3>
              <p className="text-sm text-red-600">这是一个错误提示卡片，告知用户出现了问题。</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            表单元素
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                输入框
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入内容"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                下拉选择框
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>选项一</option>
                <option>选项二</option>
                <option>选项三</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-700">
                复选框
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
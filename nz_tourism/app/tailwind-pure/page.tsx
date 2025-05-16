'use client';

export default function PureTailwindTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">纯Tailwind CSS测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">基础组件测试</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">按钮</h3>
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  主要按钮
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                  次要按钮
                </button>
                <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-md">
                  描边按钮
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">卡片</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">卡片标题</h4>
                  <p className="text-gray-600 text-sm">这是使用Tailwind CSS创建的简单卡片。</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">卡片标题</h4>
                  <p className="text-gray-600 text-sm">这是使用Tailwind CSS创建的简单卡片。</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">卡片标题</h4>
                  <p className="text-gray-600 text-sm">这是使用Tailwind CSS创建的简单卡片。</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">警告框</h3>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-md">
                这是一个使用Tailwind CSS创建的警告框。
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">搜索栏测试</h2>
          <form className="flex w-full max-w-md">
            <input 
              type="text"
              placeholder="搜索内容..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-md font-medium"
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 
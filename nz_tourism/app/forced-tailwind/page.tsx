'use client';

export default function ForcedTailwindPage() {
  return (
    <div className="forced-tailwind [&_*]:!font-sans">
      {/* 添加全局样式覆盖 */}
      <style jsx global>{`
        .forced-tailwind * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .forced-tailwind button,
        .forced-tailwind input {
          all: revert;
          font-family: sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="!text-3xl !font-bold !text-blue-600 !mb-8 !text-center">
            强制使用Tailwind CSS
          </h1>
          
          <div className="!bg-white !rounded-lg !shadow-md !p-6 !mb-8">
            <h2 className="!text-xl !font-semibold !text-gray-800 !mb-4">
              按钮和卡片测试
            </h2>
            
            <div className="!flex !flex-wrap !gap-4 !mb-6">
              <button className="!bg-blue-500 !text-white !px-4 !py-2 !rounded-md !font-bold !hover:bg-blue-700">
                蓝色按钮
              </button>
              <button className="!bg-green-500 !text-white !px-4 !py-2 !rounded-md !font-bold !hover:bg-green-700">
                绿色按钮
              </button>
              <button className="!bg-red-500 !text-white !px-4 !py-2 !rounded-md !font-bold !hover:bg-red-700">
                红色按钮
              </button>
            </div>
            
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
              <div className="!bg-white !border !border-gray-200 !rounded-lg !p-4 !shadow-sm">
                <h3 className="!font-bold !text-gray-800 !mb-2">卡片标题</h3>
                <p className="!text-gray-600 !text-sm">使用强制优先级的Tailwind类</p>
              </div>
              <div className="!bg-white !border !border-gray-200 !rounded-lg !p-4 !shadow-sm">
                <h3 className="!font-bold !text-gray-800 !mb-2">卡片标题</h3>
                <p className="!text-gray-600 !text-sm">使用强制优先级的Tailwind类</p>
              </div>
              <div className="!bg-white !border !border-gray-200 !rounded-lg !p-4 !shadow-sm">
                <h3 className="!font-bold !text-gray-800 !mb-2">卡片标题</h3>
                <p className="!text-gray-600 !text-sm">使用强制优先级的Tailwind类</p>
              </div>
            </div>
          </div>
          
          <div className="!bg-white !rounded-lg !shadow-md !p-6">
            <h2 className="!text-xl !font-semibold !text-gray-800 !mb-4">
              搜索栏测试
            </h2>
            
            <form className="!flex !w-full !max-w-md !mx-auto">
              <input 
                type="text"
                placeholder="搜索内容..."
                className="!flex-grow !px-4 !py-2 !border !border-gray-300 !rounded-l-md !focus:outline-none !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500"
              />
              <button 
                type="submit"
                className="!bg-blue-500 !text-white !px-6 !py-2 !rounded-r-md !font-medium !hover:bg-blue-600"
              >
                搜索
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
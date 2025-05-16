'use client';

export default function TailwindNewTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <div className="h-48 w-full bg-blue-500 md:h-full md:w-48"></div>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">全新测试</div>
            <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
              测试Tailwind CSS是否正常工作
            </h2>
            <p className="mt-2 text-slate-500">
              这个页面使用了最新安装的Tailwind CSS配置。如果您能看到样式正确应用，说明配置已经成功。
            </p>
            <div className="mt-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                测试按钮
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 max-w-md mx-auto">
        <form className="grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-gray-700">输入框</span>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="请输入..."
            />
          </label>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            提交
          </button>
        </form>
      </div>
    </div>
  );
} 
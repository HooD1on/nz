// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  // 要扫描 Tailwind 类的源码路径
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // 如果你在 lib/ 或者其他地方也会用到 tailwind 类，就一并加上
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 在这里放你自定义的颜色、spacing、breakpoints……
      colors: {
        primary: '#1E40AF',
        secondary: '#2563EB',
      },
      textShadow: {
        'lg': '2px 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // 需要别的插件也在这里引入
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-lg': {
          'text-shadow': '2px 2px 8px rgba(0, 0, 0, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config

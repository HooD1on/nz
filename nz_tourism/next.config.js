/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5152/api/:path*',
        has: [
          {
            type: 'header',
            key: 'x-not-auth',
            value: '(?!true)',  // 这是一个总是匹配的条件，不会实际筛选请求
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

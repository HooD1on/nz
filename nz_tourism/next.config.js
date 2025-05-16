/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5152/api/:path*',
        has: [
          {
            type: 'prefix',
            value: '/api',
            not: ['/api/auth']  // 排除 NextAuth 路由
          }
        ]
      }
    ]
  }
}

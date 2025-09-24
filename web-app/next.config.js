/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'api.example.com'],
  },
  env: {
    CUSTOM_KEY: 'medicine-management-app',
  },
}

module.exports = nextConfig
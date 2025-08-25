/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  images: {
    domains: [
      'i.scdn.co',
      'cdn.cosmicjs.com',
    ],
  },
}

module.exports = nextConfig
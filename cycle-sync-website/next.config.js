/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Remove static export for Vercel deployment
  // output: 'export',
  // distDir: 'out',
  // trailingSlash: true,
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;
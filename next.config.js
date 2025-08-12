/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // Configure for Cloudflare Pages
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
}
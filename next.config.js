/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // Configure for Cloudflare Pages
  output: 'export',
  // Do not set a custom distDir - let Next.js use its default '.next'
  trailingSlash: true,
}
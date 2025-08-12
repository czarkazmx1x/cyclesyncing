/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // Configure for Cloudflare Pages
  output: 'export',
  // Use a traditional SPA approach for Cloudflare Pages
  trailingSlash: true,
  // Disable image optimization which isn't compatible with static export
  images: {
    unoptimized: true,
  },
  // Add special handling for API routes in static export
  async rewrites() {
    return {
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
    }
  },
}
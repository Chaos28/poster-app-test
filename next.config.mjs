/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/api/next/:path*',
          destination: '/api/next/:path*',
        },
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PROXY_FALLBACK}/api/:path*`,
        },
      ]
    };
  },
}

export default nextConfig

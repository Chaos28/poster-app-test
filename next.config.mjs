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
    const proxyFallback = process.env.NEXT_PROXY_FALLBACK || 'https://posters.aiml.cgify.com'

    return {
      afterFiles: [
        {
          source: '/api/next/:path*',
          destination: '/api/next/:path*',
        },
        {
          source: '/api/:path*',
          destination: `${proxyFallback}/api/:path*`,
        },
      ]
    };
  },
}

export default nextConfig

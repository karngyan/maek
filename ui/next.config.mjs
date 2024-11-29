const API_URL = process.env.API_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: `${API_URL}/v1/:path*`,
      },
    ]
  },
}

export default nextConfig

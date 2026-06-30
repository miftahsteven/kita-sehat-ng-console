import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.kita-sehat.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kita-sehat.id",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'https://api.kita-sehat.id/uploads/:path*'
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4003'}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

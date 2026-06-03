import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
    ],
  },
  serverExternalPackages: ['better-sqlite3'],
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
};

export default nextConfig;

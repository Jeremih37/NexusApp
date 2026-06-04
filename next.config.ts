import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // RAWG CDN - primary source for game covers (HD images)
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
      // YouTube thumbnails for trailers
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      // Placeholder images (fallback when no RAWG key)
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Legacy IGDB (being replaced by RAWG)
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
    ],
  },
};

export default nextConfig;

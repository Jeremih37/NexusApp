import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // Steam CDN - verified HD game covers (public, no API key needed)
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      // RAWG CDN - additional game data source
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
      // YouTube thumbnails for trailers
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      // Placeholder images (fallback)
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Legacy IGDB (being replaced)
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
    ],
  },
};

export default nextConfig;

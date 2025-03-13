import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL 
      ? process.env.NEXT_PUBLIC_VERCEL_ENV || "production" 
      : "local",
  },
};

export default nextConfig;

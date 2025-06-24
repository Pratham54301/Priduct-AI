
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  server: {
    port: 9002,
    hostname: '0.0.0.0',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['6000-firebase-studio-1750417047903.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev'],
  },
};

export default nextConfig;


import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV === 'development';

// Dozwolone originy dla środowiska deweloperskiego (np. Cloud Workstations).
const allowedDevOrigins = [
  '*.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev',
  'http://localhost:3000',
];


const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fci.be',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'www.zkwp.pl',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ustawienia eksperymentalne, działają tylko w trybie deweloperskim
  ...(isDev && {
    experimental: {
      allowedDevOrigins,
    },
  }),
};

export default nextConfig;

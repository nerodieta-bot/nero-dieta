
import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV === 'development';

// ✅ Dynamiczne wczytywanie dozwolonych originów ze zmiennej środowiskowej
// W pliku .env można ustawić: DEV_ALLOWED_ORIGINS="http://localhost:3000,https://<twoje>.cloudworkstations.dev"
const allowedDevOriginsFromEnv =
  process.env.DEV_ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];


const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Zachowane z Twojej konfiguracji
  
  typescript: {
    ignoreBuildErrors: true, // Zachowane z Twojej konfiguracji
  },
  
  eslint: {
    ignoreDuringBuilds: true, // Zachowane z Twojej konfiguracji
  },

  images: {
    // Twoje istniejące, działające remotePatterns
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
        protocol: 'https'
        ,
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
  
  // Nowoczesna konfiguracja "whitelist" dla środowiska deweloperskiego
  ...(isDev && {
    experimental: {
      allowedDevOrigins:
        allowedDevOriginsFromEnv.length > 0
          ? allowedDevOriginsFromEnv
          : [
              'http://localhost:3000',
              // Tutaj możesz wkleić zapasowy, dokładny origin z Cloud Workstations, jeśli .env nie jest używane
            ],
    },
  }),

  // Drobne, ale przydatne optymalizacje
  poweredByHeader: false, // Poprawa bezpieczeństwa
};

export default nextConfig;

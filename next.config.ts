
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
    ],
  },
  serverComponentsExternalPackages: [
    '@genkit-ai/googleai',
    '@genkit-ai/core',
    '@genkit-ai/firebase',
    'genkit',
    '@opentelemetry/exporter-jaeger',
    '@opentelemetry/winston-transport',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'localhost:5000'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only packages from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
      
      // Prevent server-only packages from being bundled for client
      // Don't externalize express directly to avoid version conflicts with @genkit-ai/core's nested dependency
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@genkit-ai/core', '@genkit-ai/googleai', '@genkit-ai/firebase', 'genkit');
      } else if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = [
          originalExternals,
          (context, request, callback) => {
            const serverOnly = ['@genkit-ai/core', '@genkit-ai/googleai', '@genkit-ai/firebase', 'genkit'];
            if (serverOnly.some(pkg => request === pkg || request?.startsWith(pkg + '/'))) {
              return callback(null, `commonjs ${request}`);
            }
            callback();
          },
        ];
      } else {
        // If it's an object, merge it
        const originalObj = config.externals;
        config.externals = {
          ...originalObj,
          '@genkit-ai/core': 'commonjs @genkit-ai/core',
          '@genkit-ai/googleai': 'commonjs @genkit-ai/googleai',
          '@genkit-ai/firebase': 'commonjs @genkit-ai/firebase',
          'genkit': 'commonjs genkit',
        };
      }
      
      // Handle dynamic requires - prevent errors from Express view engine
      config.module = config.module || {};
      config.module.unknownContextCritical = false;
      
      // Use the new webpack 5 API for unknown context handling
      config.module.parser = config.module.parser || {};
      config.module.parser.javascript = config.module.parser.javascript || {};
      config.module.parser.javascript.unknownContextCritical = false;
      
      // Ignore Express view.js dynamic requires that cause build errors
      const webpack = require('webpack');
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /express\/lib\/view\.js$/,
        })
      );
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

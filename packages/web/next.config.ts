import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@htsbots/shared"],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
        encoding: false,
      };
    }
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push("pino-pretty", "encoding");
      }
    }
    // Fix for @react-native-async-storage/async-storage
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage":
        require.resolve("@react-native-async-storage/async-storage"),
    };
    return config;
  },
};

export default nextConfig;

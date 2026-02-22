import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@htsbots/shared"],
  reactStrictMode: true,
};

export default nextConfig;

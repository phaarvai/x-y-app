import type { NextConfig } from "next";

const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  serverExternalPackages: ["postgres"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

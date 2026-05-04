import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || "",
  serverExternalPackages: ["postgres"],
};

export default nextConfig;

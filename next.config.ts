import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Build tetap jalan walau ada error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Build tetap jalan walau ada error TS
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

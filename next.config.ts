import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactCompiler: true,
  typedRoutes: true,
  compiler: {
    removeConsole: true,
  },
  experimental: {
    // ✅ framer-motion সরানো হয়েছে — আর use হচ্ছে না
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
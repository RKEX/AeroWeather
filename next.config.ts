import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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

export default withNextIntl(nextConfig);
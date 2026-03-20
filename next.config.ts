import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typedRoutes: true,
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;

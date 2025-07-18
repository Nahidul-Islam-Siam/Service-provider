import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        // You can specify port or omit it to allow any port
        // port: "3000", 
      },
    ],
  },
};

export default nextConfig;

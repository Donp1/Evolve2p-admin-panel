import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://via.placeholder.com/300x200.png?text=Proof+of+Payment"),
    ],
  },
};

export default nextConfig;

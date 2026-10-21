import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML in `out/`, served by Nginx (roadmap phase 7).
  output: "export",
  // `/fa/menu/` → `out/fa/menu/index.html`, so Nginx serves folders directly.
  trailingSlash: true,
  // No image server in a static export; images get optimized at build time later.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

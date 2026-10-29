import type { NextConfig } from "next";

// The site runs as a Next.js server in a container (output: "standalone"),
// behind Nginx on the VPS. Only the build output goes into the image.
const security = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // `/fa/menu/` style URLs, as before
  trailingSlash: true,
  // Photos are already resized and compressed by scripts/build-photos.mjs.
  images: { unoptimized: true },
  poweredByHeader: false,
  // Nginx on the server gzips responses: no second compression in Node
  compress: false,
  // Real HTTP redirects now that there is a server. The table QR code points
  // to /menu/, so that address must keep working forever.
  async redirects() {
    return [
      { source: "/", destination: "/fa/", permanent: false },
      { source: "/menu", destination: "/fa/menu/", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: security }];
  },
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

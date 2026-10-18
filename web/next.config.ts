import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server (`.next/standalone`) that runs via
  // `node server.js` with only the dependencies it needs. This is what the
  // deploy image copies — without it the container would need the full
  // node_modules tree and the whole source checkout at runtime.
  output: "standalone",
  /* config options here */
  // Hide the Next.js dev toolbar/indicator overlay in development.
  devIndicators: false,
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

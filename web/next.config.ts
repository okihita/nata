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
  // Types are verified in pre-commit git hooks / local checks.
  // Skipping them in Docker compilation saves ~15s per build.
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      { source: "/dasbor", destination: "/dashboard" },
      { source: "/catat", destination: "/record" },
      { source: "/transaksi", destination: "/transactions" },
      { source: "/akun", destination: "/accounts" },
      { source: "/laporan", destination: "/statements" },
      { source: "/pajak", destination: "/taxes" },
      { source: "/perizinan", destination: "/licensing" },
      { source: "/akademi", destination: "/academy" },
      { source: "/usaha", destination: "/business" },
      { source: "/pengaturan", destination: "/settings" },
    ];
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

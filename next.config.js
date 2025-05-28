// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: false,
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

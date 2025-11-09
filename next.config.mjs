/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/open-spec-hub',
  assetPrefix: '/open-spec-hub/',
  trailingSlash: true,
};

export default nextConfig;

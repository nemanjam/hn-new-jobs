import { withPlausibleProxy } from 'next-plausible';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

// custom self-hosted Plausible domain configured in provider
const withPlausibleProxyFn = withPlausibleProxy();

export default withPlausibleProxyFn(nextConfig);

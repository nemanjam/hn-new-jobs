import { withPlausibleProxy } from 'next-plausible';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

// must set it both here and in provider
const withPlausibleProxyFn = withPlausibleProxy({
  customDomain: process.env.PLAUSIBLE_SERVER_URL,
});

export default withPlausibleProxyFn(nextConfig);

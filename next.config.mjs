import { withPlausibleProxy } from 'next-plausible';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

// must set it both here and in provider
// here must set it at BUILD TIME, build-arg in Docker, Github Actions
const withPlausibleProxyFn = withPlausibleProxy({
  customDomain: process.env.PLAUSIBLE_SERVER_URL,
});

export default withPlausibleProxyFn(nextConfig);

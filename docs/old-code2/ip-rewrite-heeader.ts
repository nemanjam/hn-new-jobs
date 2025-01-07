
// https://chatgpt.com/share/677cfe66-1178-8012-aa18-57cc33de7899

// middleware.ts

import { NextResponse, NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  const userAgentString = request.headers.get('user-agent') ?? '';

  if (userAgentString.includes('Googlebot')) {
    console.log(
      `Googlebot detected: ${new Date().toISOString()}, pathname: ${request.nextUrl.pathname}, userAgentString: ${userAgentString}`
    );
  }

  // Check if the path matches the rewrite pattern for '/js/*'
  if (request.nextUrl.pathname.startsWith('/js/')) {
    const response = NextResponse.rewrite(
      `${process.env.PLAUSIBLE_SERVER_URL}${request.nextUrl.pathname}`
    );
    response.headers.set('X-Forwarded-For', request.headers.get('x-forwarded-for') ?? request.ip ?? '');
    return response;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/js/:path*'], // Apply middleware only to these paths
};

// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/js/:path*',
          destination: `${process.env.PLAUSIBLE_SERVER_URL}/:path*`,
        },
      ];
    },
  };
  
  module.exports = nextConfig;

//   -----
const nextConfig1 = {
    rewrites: async () => [
        {
        // https://hackernews-new-jobs.arm1.nemanjamitic.com/js/script.local.js
        source: '/js/*',
        headers: [{ key: 'X-Forwarded-For', value: '{http-client-ip}' }],
        // https://plausible.arm1.nemanjamitic.com/js/script.js
        destination: `${process.env.PLAUSIBLE_SERVER_URL}/*`,
        },
    ],
}
  
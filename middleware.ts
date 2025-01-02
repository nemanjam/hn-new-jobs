import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  const userAgentString = request.headers.get('user-agent') ?? '';

  if (userAgentString.includes('Googlebot'))
    console.log(
      `Googlebot detected: ${new Date().toISOString()}, pathname: ${request.nextUrl.pathname}, userAgentString: ${userAgentString}`
    );

  return NextResponse.next();
};

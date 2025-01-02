import { NextResponse } from 'next/server';

import logger from '@/libs/winston';

import type { NextRequest } from 'next/server';

export const middleware = (request: NextRequest) => {
  const userAgentString = request.headers.get('user-agent') ?? '';

  if (userAgentString.includes('Googlebot'))
    logger.info(
      `Googlebot detected, pathname: ${request.nextUrl.pathname}, userAgentString: ${userAgentString}`
    );

  return NextResponse.next();
};

import { NextResponse } from 'next/server';

import { callParseNewMonth, callParseNOldMonths, callParseOldMonth } from '@/modules/parser/calls';
import { getLastMonth } from '@/modules/database/select/month';
import logger from '@/libs/winston';
import { SCRIPTS } from '@/constants/scripts';
import { SERVER_CONFIG } from '@/config/server';

import type { ErrorResponse, ParserResponse, ParserRouteParam } from '@/types/api';

export const dynamic = 'force-dynamic';

const { apiSecret } = SERVER_CONFIG;

const scripts = Object.values(SCRIPTS);

/**
 * Called by cron with curl. Benefit: single Next.js build context without node_modules for .ts scripts.
 *
 * @example http://localhost:3000/api/parser/new?parser-secret=my-secret
 */

export const GET = async (
  request: Request,
  { params }: ParserRouteParam
): Promise<NextResponse<ParserResponse | ErrorResponse>> => {
  // 1. permissions
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('parser-secret');

  if (secretParam !== apiSecret) {
    logger.error(`Wrong parser-secret: ${secretParam}`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. script param
  const { script } = await params;

  if (!scripts.includes(script)) {
    logger.error(`Wrong route param script: ${script}`);
    return NextResponse.json({ error: 'Invalid route param.' }, { status: 400 });
  }

  const lastMonth = getLastMonth();
  console.log('lastMonth before call: ', lastMonth);

  try {
    switch (script) {
      case SCRIPTS.parseNew: {
        const parserResponse: ParserResponse = await callParseNewMonth();

        const lastMonth = getLastMonth();
        console.log('lastMonth after call: ', lastMonth);

        return NextResponse.json(parserResponse);
      }
      case SCRIPTS.parseOld: {
        const parserResponse: ParserResponse = await callParseOldMonth();

        const lastMonth = getLastMonth();
        console.log('lastMonth after call: ', lastMonth);

        return NextResponse.json(parserResponse);
      }
      case SCRIPTS.parseOldMany: {
        const parserResponse: ParserResponse = await callParseNOldMonths();
        return NextResponse.json(parserResponse);
      }
      default: {
        logger.error('Not allowed script triggered.', script);
        return NextResponse.json({ error: 'Not allowed.' }, { status: 401 });
      }
    }
  } catch (error) {
    logger.error('Parsing failed.', error);
    return NextResponse.json({ error: 'Parsing failed.' }, { status: 400 });
  }
};

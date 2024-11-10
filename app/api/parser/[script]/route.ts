import { NextResponse } from 'next/server';

import { callParseNewMonth, callParseNOldMonths, callParseOldMonth } from '@/modules/parser/calls';
import { SCRIPTS } from '@/constants/scripts';
import { PARSER_CONFIG } from '@/config/parser';

import type { ErrorResponse, ParserResponse, ParserRouteParam } from '@/types/api';

export const dynamic = 'force-dynamic';

const { parserSecret } = PARSER_CONFIG;

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

  if (secretParam !== parserSecret) {
    console.error(`Wrong parser-secret: ${secretParam}`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. script param
  const { script } = await params;

  if (!scripts.includes(script)) {
    console.error(`Wrong route param script: ${script}`);
    return NextResponse.json({ error: 'Invalid route param.' }, { status: 400 });
  }

  try {
    switch (script) {
      case SCRIPTS.parseNew: {
        const parserResponse: ParserResponse = await callParseNewMonth();
        return NextResponse.json(parserResponse);
      }
      case SCRIPTS.parseOld: {
        const parserResponse: ParserResponse = await callParseOldMonth();
        return NextResponse.json(parserResponse);
      }
      case SCRIPTS.parseOldMany: {
        const parserResponse: ParserResponse = await callParseNOldMonths();
        return NextResponse.json(parserResponse);
      }
    }
  } catch (error) {
    console.error('Parsing failed.', error);
    return NextResponse.json({ error: 'Parsing failed.' }, { status: 400 });
  }
};

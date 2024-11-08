import { NextResponse } from 'next/server';

import { parseNewMonth, parseNOldMonths, parseOldMonth } from '@/modules/parser/parse';
import { CONFIG } from '@/config/parser';

import type { ErrorResponse, ParserResponse, ParserRouteParam } from '@/types/api';
import type { ParserResult } from '@/types/parser';

const { parserSecret, scripts } = CONFIG;

export const dynamic = 'force-dynamic';

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
      case 'new': {
        const parserResult: ParserResult = await parseNewMonth();
        return NextResponse.json({
          parserResults: [parserResult],
          message: 'Parsing new month successful.',
        });
      }
      case 'old': {
        const parserResult: ParserResult = await parseOldMonth();
        return NextResponse.json({
          parserResults: [parserResult],
          message: 'Parsing one old month successful.',
        });
      }
      case 'old-many': {
        const parserResults: ParserResult[] = await parseNOldMonths();
        return NextResponse.json({
          parserResults,
          message: `Parsing ${parserResults.length} old months successful.`,
        });
      }
    }
  } catch (error) {
    console.error('Parsing failed.', error);
    return NextResponse.json({ error: 'Parsing failed.' }, { status: 400 });
  }
};

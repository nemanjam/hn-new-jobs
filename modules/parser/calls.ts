import { parseNewMonth, parseNOldMonths, parseOldMonth } from '@/modules/parser/parse';
import { getAppNow } from '@/libs/datetime';
import { SERVER_CONFIG } from '@/config/server';

import { ParserResponse } from '@/types/api';
import { ParserResult } from '@/types/parser';

const { oldMonthsCount } = SERVER_CONFIG;

/**
 * Reused in:
 *
 * modules/scheduler/main.ts
 * app/api/parser/[script]/route.ts
 * modules/parser/main.ts
 *
 * These can throw.
 */

export const callParseNewMonth = async (): Promise<ParserResponse> => {
  const parserResult: ParserResult = await parseNewMonth();

  const parserResponse: ParserResponse = {
    parseMessage: `Parsing new month successful, now: ${getAppNow()}.`,
    parserResults: [parserResult],
  };

  return parserResponse;
};

export const callParseOldMonth = async (): Promise<ParserResponse> => {
  const parserResult: ParserResult = await parseOldMonth();

  const parserResponse: ParserResponse = {
    parseMessage: `Parsing old month successful, now: ${getAppNow()}.`,
    parserResults: [parserResult],
  };

  return parserResponse;
};

export const callParseNOldMonths = async (): Promise<ParserResponse> => {
  const parserResults: ParserResult[] = await parseNOldMonths(oldMonthsCount);

  const parserResponse: ParserResponse = {
    parserResults,
    parseMessage: `Parsing ${parserResults.length} old months successful, now: ${getAppNow()}.`,
  };

  return parserResponse;
};

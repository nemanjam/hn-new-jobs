import { CONFIG } from '@/config/parser';

import type { ParserResult } from '@/types/parser';

const { scripts } = CONFIG;
/*-------------------------------- general api ------------------------------*/

export interface ErrorResponse {
  error: string;
}

/*-------------------------------- parser api ------------------------------*/

export interface ParserResponse {
  parserResults: ParserResult[];
  message: string;
}

export type ScriptType = (typeof scripts)[number];

export interface ParserRouteParam {
  params: Promise<{
    script: ScriptType;
  }>;
}

import { SCRIPTS } from '@/constants/scripts';

import type { ParserResult } from '@/types/parser';

/*-------------------------------- general api ------------------------------*/

export interface ErrorResponse {
  error: string;
}

/*-------------------------------- parser api ------------------------------*/

export interface ParserResponse {
  parserResults: ParserResult[];
  parseMessage: string;
}

export type ScriptType = (typeof SCRIPTS)[keyof typeof SCRIPTS];

export interface ParserRouteParam {
  params: Promise<{
    script: ScriptType;
  }>;
}

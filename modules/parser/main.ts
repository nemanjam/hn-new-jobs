import { callParseNewMonth, callParseNOldMonths, callParseOldMonth } from '@/modules/parser/calls';
import logger from '@/libs/winston';
import { SCRIPTS } from '@/constants/scripts';
import { PARSER_CONFIG } from '@/config/parser';

import { ParserResponse, ScriptType } from '@/types/api';

const { nodeEnv } = PARSER_CONFIG;

/** This can be used as cli script only in dev or in prod WITH node_modules folder. */

const main = async (script: ScriptType) => {
  switch (script) {
    case SCRIPTS.parseNew: {
      const parserResponse: ParserResponse = await callParseNewMonth();
      logger.info('main.ts script', parserResponse);
      break;
    }
    case SCRIPTS.parseOld: {
      const parserResponse: ParserResponse = await callParseOldMonth();
      logger.info('main.ts script', parserResponse);
      break;
    }
    case SCRIPTS.parseOldMany: {
      const parserResponse: ParserResponse = await callParseNOldMonths();
      logger.info('main.ts script', parserResponse);
      break;
    }
  }
};

const mainDev = () => {
  const args = process.argv.slice(2);
  logger.info('Received arguments:', args);

  const script = args[0] as ScriptType;

  main(script);
};

// todo: fix this
if (nodeEnv !== 'production') {
  mainDev();
}

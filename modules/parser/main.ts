import { callParseNewMonth, callParseNOldMonths, callParseOldMonth } from '@/modules/parser/calls';
import {
  deleteMonthsAndCompaniesNewerThanMonth,
  deleteMonthsAndCompaniesOlderThanMonth,
} from '@/modules/database/delete';
import logger from '@/libs/winston';
import { SCRIPTS } from '@/constants/scripts';
import { SERVER_CONFIG } from '@/config/server';
import { getStatistics } from '../database/select/statistics';

import { ParserResponse, ScriptType } from '@/types/api';

const { nodeEnv } = SERVER_CONFIG;

/** This can be used as cli script only in dev or in prod WITH node_modules folder. */

const main = async (script: ScriptType) => {
  switch (script) {
    case SCRIPTS.parseNew: {
      const parserResponse: ParserResponse = await callParseNewMonth();
      logger.info('main.ts parseNew script, parserResponse:', { parserResponse });
      break;
    }
    case SCRIPTS.parseOld: {
      const parserResponse: ParserResponse = await callParseOldMonth();
      logger.info('main.ts parseOld script, parserResponse:', parserResponse);
      break;
    }
    case SCRIPTS.parseOldMany: {
      // PARSER_CONFIG.oldMonthsCount = 12
      const parserResponse: ParserResponse = await callParseNOldMonths();
      logger.info('main.ts parseOldMany script, parserResponse:', parserResponse);
      break;
    }
    case SCRIPTS.trimOld: {
      const statisticsBefore = getStatistics();
      const rowsCount = deleteMonthsAndCompaniesOlderThanMonth();
      const statisticsAfter = getStatistics();

      const context = { rowsCount, statisticsBefore, statisticsAfter };
      logger.info('main.ts script, deleted old rows:', context);

      break;
    }
    // for debugging cache.clear()
    case SCRIPTS.trimNew: {
      const statisticsBefore = getStatistics();
      const rowsCount = deleteMonthsAndCompaniesNewerThanMonth();
      const statisticsAfter = getStatistics();

      const context = { rowsCount, statisticsBefore, statisticsAfter };
      logger.info('main.ts script, deleted new rows:', context);
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

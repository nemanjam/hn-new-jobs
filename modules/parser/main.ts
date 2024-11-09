import { callParseNewMonth, callParseNOldMonths, callParseOldMonth } from '@/modules/parser/calls';
import { SCRIPTS } from '@/constants/scripts';
import { CONFIG } from '@/config/parser';

import { ParserResponse, ScriptType } from '@/types/api';

const { nodeEnv } = CONFIG;

/** This can be used as cli script only in dev or in prod WITH node_modules folder. */

const main = async (script: ScriptType) => {
  switch (script) {
    case SCRIPTS.parseNew: {
      const parserResponse: ParserResponse = await callParseNewMonth();
      console.log(parserResponse);
      break;
    }
    case SCRIPTS.parseOld: {
      const parserResponse: ParserResponse = await callParseOldMonth();
      console.log(parserResponse);
      break;
    }
    case SCRIPTS.parseOldMany: {
      const parserResponse: ParserResponse = await callParseNOldMonths();
      console.log(parserResponse);
      break;
    }
  }
};

const mainDev = () => {
  const args = process.argv.slice(2);
  console.log('Received arguments:', args);

  const script = args[0] as ScriptType;

  main(script);
};

// todo: fix this
if (nodeEnv !== 'production') {
  mainDev();
}

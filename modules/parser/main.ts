import { parseNewMonth, parseNOldMonths, parseOldMonth } from '@/modules/parser/parse';
import { CONFIG } from '@/config/parser';

import { ScriptType } from '@/types/api';
import { ParserResult } from '@/types/parser';

const { nodeEnv } = CONFIG;

/** This can be used as cli script only in dev or in prod WITH node_modules folder. */

const main = async (script: ScriptType) => {
  switch (script) {
    case 'new': {
      const parserResult: ParserResult = await parseNewMonth();
      console.log('parserResult', parserResult);
      break;
    }
    case 'old': {
      const parserResult: ParserResult = await parseOldMonth();
      console.log('parserResult', parserResult);
      break;
    }
    case 'old-many': {
      const parserResults: ParserResult[] = await parseNOldMonths();
      console.log('parserResult', parserResults);
      break;
    }

    default:
      break;
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

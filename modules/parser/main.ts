import { parseNewMonth, parseNOldMonths } from '@/modules/parser/parse';

/** This can be used as cli script only in dev or in prod WITH node_modules folder. */

const main = async (script: string) => {
  switch (script) {
    case 'new':
      await parseNewMonth();
      break;
    case 'old':
      await parseNOldMonths();
      break;

    default:
      break;
  }
};

const mainDev = () => {
  const args = process.argv.slice(2);
  console.log('Received arguments:', args);

  const script = args[0];

  main(script);
};

if (process.env.NODE_ENV === 'development') {
  mainDev();
}

import { compareAllMonths, getNumberOfMonthsForLastMonthsCompanies } from '@/modules/parser/months';
import { parseNewMonth } from './parse';
import { getThreads } from './scraper/threads';

async function parse({ whichMonths = 'last-two' }) {
  //

  async function main() {
    switch (whichMonths) {
      case 'last-two':
        // await compareLastTwoMonths();
        // await parseNewMonth();
        await getThreads();
        break;
      case 'all':
        await compareAllMonths();
        break;
      case 'companies':
        await getNumberOfMonthsForLastMonthsCompanies();
        break;

      default:
        break;
    }
  }

  await main();
}

(function () {
  const options = {
    whichMonths: 'last-two',
  };

  parse(options);
})();

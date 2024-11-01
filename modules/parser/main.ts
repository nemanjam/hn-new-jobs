import { compareAllMonths, getNumberOfMonthsForLastMonthsCompanies } from '@/modules/parser/months';
import { SCRAPER } from '@/constants/scraper';
import { parseNewMonth } from './parse';
import { fetchHtml } from './scraper/fetch-html';
import { getThreads } from './scraper/threads';

async function parse({ whichMonths = 'last-two' }) {
  //

  async function main() {
    switch (whichMonths) {
      case 'last-two':
        // await compareLastTwoMonths();
        // await parseNewMonth();
        const threads = await getThreads();
        console.log('threads', threads);
        // const htmlContent = await fetchHtml(SCRAPER.threads.threadsUrl);
        // console.log('htmlContent', htmlContent);

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

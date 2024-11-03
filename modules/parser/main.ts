// import { compareAllMonths, getNumberOfMonthsForLastMonthsCompanies } from '@/modules/parser/months';
import { SCRAPER } from '@/constants/scraper';
import { parseNewMonth, parseOldMonth } from './parse';
import { fetchHtml } from './scraper/fetch-html';
import { getThreads } from './scraper/threads';

async function parse({ whichMonths = 'last-two' }) {
  //
  const url1 = 'https://news.ycombinator.com/item?id=41709301&p=1';

  async function main() {
    switch (whichMonths) {
      case 'last-two':
        // await compareLastTwoMonths();
        await parseNewMonth();
        // await parseOldMonth();
        // const threads = await getThreads();
        // console.log('threads', threads);
        // const htmlContent = await fetchHtml(SCRAPER.threads.threadsUrl);
        // const htmlContent = await fetchHtml(url1);
        // console.log('htmlContent 1', htmlContent);

        break;
      case 'all':
        // await compareAllMonths();
        break;
      case 'companies':
        // await getNumberOfMonthsForLastMonthsCompanies();
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

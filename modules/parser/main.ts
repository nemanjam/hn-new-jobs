// import { compareAllMonths, getNumberOfMonthsForLastMonthsCompanies } from '@/modules/parser/months';
import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import { parseNewMonth, parseOldMonth } from '@/modules/parser/parse';

const main = async () => {
  // await compareLastTwoMonths();
  // await parseNewMonth();
  await parseOldMonth();
  // const threads = await getThreads();
  // console.log('threads', threads);
  // const parsedCompanies = await parseCompaniesForThread('42017580');
  // console.log('parsedCompanies', parsedCompanies.length);
  // const htmlContent = await fetchHtml(SCRAPER.threads.threadsUrl);
  // const htmlContent = await fetchHtml(url1);
  // console.log('htmlContent 1', htmlContent);
};

main();

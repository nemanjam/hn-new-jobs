import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import {
  getFirstTimeCompaniesForLastMonth,
  getNOCompaniesForLastTwoMonths,
} from '@/modules/parser/database';
import { parseNewMonth, parseNOldMonths, parseOldMonth } from '@/modules/parser/parse';

const main = async () => {
  // await compareLastTwoMonths();
  // await parseNewMonth();
  // await parseOldMonth();
  await parseNOldMonths(5);
  // const firstTimeCompanies = await getFirstTimeCompaniesForLastMonth();
  // console.log('firstTimeCompanies', firstTimeCompanies.length);
  // const noCompanies = getNOCompaniesForLastTwoMonths();
  // console.log('noCompanies.newCompanies.length', noCompanies.newCompanies.length);
  // console.log('noCompanies.oldCompanies.length', noCompanies.oldCompanies.length);
  // const threads = await getThreads();
  // console.log('threads', threads);
  // const parsedCompanies = await parseCompaniesForThread('42017580');
  // console.log('parsedCompanies', parsedCompanies.length);
  // const htmlContent = await fetchHtml(SCRAPER.threads.threadsUrl);
  // const htmlContent = await fetchHtml(url1);
  // console.log('htmlContent 1', htmlContent);
};

main();

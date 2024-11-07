import { parseCompaniesForThread } from '@/modules/parser/algolia/comments';
import { getThreads } from '@/modules/parser/algolia/threads';
import {
  getCommentsForLastMonthsCompanies,
  getFirstTimeCompaniesForLastMonth,
  getNOCompaniesForLastTwoMonths,
} from '@/modules/parser/database';
import { parseNewMonth, parseNOldMonths, parseOldMonth } from '@/modules/parser/parse';

const main = async () => {
  // await parseNewMonth();
  // await parseOldMonth();
  // await parseNOldMonths(5);
  // const lastMonthsCompanies = getCommentsForLastMonthsCompanies();
  // console.log('lastMonthsCompanies', lastMonthsCompanies);
  // const firstTimeCompanies = getFirstTimeCompaniesForLastMonth();
  // console.log('firstTimeCompanies', firstTimeCompanies.length);
  // const noCompanies = getNOCompaniesForLastTwoMonths();
  // console.log('noCompanies.newCompanies.length', noCompanies.newCompanies.length);
  // console.log('noCompanies.oldCompanies.length', noCompanies.oldCompanies.length);
  // const threads = await getThreads();
  // console.log('threads', threads);
  // const parsedCompanies = await parseCompaniesForThread('42017580');
  // console.log('parsedCompanies', parsedCompanies.length);
};

main();

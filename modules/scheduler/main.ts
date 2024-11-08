import cron from 'node-cron';

import { parseNewMonth } from '@/modules/parser/parse';
import { getBelgradeTime, isWeekendAndStartOfMonth } from '@/libs/datetime';

import { ParserResponse } from '@/types/api';
import { ParserResult } from '@/types/parser';

export const initScheduler = () => {
  // debugging
  cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  });

  /** Every 2-15 in month at 9:00am if 2nd isn't weekend day. */
  cron.schedule(
    '0 9 2-15 * *',
    async (a) => {
      const now = new Date();

      if (isWeekendAndStartOfMonth(now)) {
        console.log(
          `Skipping parsing new month, month starts with weekend, now: ${getBelgradeTime(now)}`
        );
        return;
      }

      try {
        const parserResult: ParserResult = await parseNewMonth();
        const parserResponse: ParserResponse = {
          message: 'Parsing new month successful.',
          parserResults: [parserResult],
        };
        console.log(parserResponse);
      } catch (error) {
        console.error('Parsing new month failed.', error);
      }
    },
    {
      name: 'new',
      timezone: 'Europe/Belgrade',
    }
  );
};

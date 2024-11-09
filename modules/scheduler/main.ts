import cron from 'node-cron';

import { callParseNewMonth, callParseNOldMonths } from '@/modules/parser/calls';
import { getAppNow, isWeekendAndStartOfMonth } from '@/libs/datetime';
import { SCRIPTS } from '@/constants/scripts';
import { PARSER_CONFIG } from '@/config/parser';

import type { ParserResponse } from '@/types/api';

const { appTimeZone } = PARSER_CONFIG;

const fiveMinutes = 5 * 60 * 1000;

export const debuggingScheduler = () => {
  const debuggingTask = cron.schedule(
    '* * * * *',
    () => {
      console.log('running a task every minute');
    },
    {
      name: 'debugging',
    }
  );

  setTimeout(() => {
    debuggingTask.stop();
    console.log('debuggingTask stopped after 5 minutes');
  }, fiveMinutes);
};

/** Every 2-15 in month at 9:00am Europe/Belgrade if 2nd isn't weekend day. */

export const newMonthScheduler = () => {
  cron.schedule(
    '0 9 2-15 * *',
    async () => {
      const now = new Date();

      if (isWeekendAndStartOfMonth(now)) {
        console.log(`Skipping parsing new month, month starts with weekend, now: ${getAppNow()}`);
        return;
      }

      try {
        const parserResponse: ParserResponse = await callParseNewMonth();
        console.log(parserResponse);
      } catch (error) {
        console.error('Parsing new month failed.', error);
      }
    },
    {
      name: SCRIPTS.parseNew,
      timezone: appTimeZone,
    }
  );
};

/** Parse N old months to seed database. Run every 10 minutes. */

export const seedOldMonthsScheduler = () => {
  let numberOfCalls = 0;

  const seedOldMonthsTask = cron.schedule(
    '*/10 * * * *',
    async () => {
      try {
        const parserResponse: ParserResponse = await callParseNOldMonths();
        console.log(parserResponse);

        numberOfCalls++;
      } catch (error) {
        console.error('Parsing old months failed.', error);
      }
    },
    {
      scheduled: false,
      name: SCRIPTS.parseOldMany,
      timezone: appTimeZone,
    }
  );

  // 5 x 5 calls
  if (numberOfCalls > 4) {
    seedOldMonthsTask.stop();
    console.log(`seedOldMonthsTask stopped after numberOfCalls: ${numberOfCalls}`);
  }
};

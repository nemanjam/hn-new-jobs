import cron from 'node-cron';

import { callParseNewMonth, callParseNOldMonths } from '@/modules/parser/calls';
import { getScheduledTasksObject, validateCronString } from '@/modules/scheduler/utils';
import { getAppNow, isWeekendAndStartOfMonth } from '@/libs/datetime';
import logger from '@/libs/winston';
import { logPrettyPrintObject } from '@/utils/pretty-print';
import { SCRIPTS } from '@/constants/scripts';
import { SERVER_CONFIG } from '@/config/server';

import type { ParserResponse } from '@/types/api';

const { appTimeZone } = SERVER_CONFIG;

const fiveMinutes = 5 * 60 * 1000;

export const debuggingScheduler = () => {
  const debuggingTask = cron.schedule(
    validateCronString('* * * * *'),
    () => {
      logger.info('running a task every minute');
    },
    {
      name: 'debugging',
    }
  );

  setTimeout(() => {
    debuggingTask.stop();
    logger.info('debuggingTask stopped after 5 minutes');
  }, fiveMinutes);
};

/** Every 2-15 in month at 9:00am Europe/Belgrade if 2nd isn't weekend day. */

export const newMonthScheduler = () => {
  cron.schedule(
    validateCronString('0 9 2-15 * *'),
    async () => {
      const now = new Date();

      if (isWeekendAndStartOfMonth(now)) {
        logger.info(`Skipping parsing new month, month starts with weekend, now: ${getAppNow()}`);
        return;
      }

      try {
        const parserResponse: ParserResponse = await callParseNewMonth();
        logger.info(parserResponse);
      } catch (error) {
        logger.error('Parsing new month failed.', error);
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
    validateCronString('*/10 * * * *'),
    async () => {
      try {
        const parserResponse: ParserResponse = await callParseNOldMonths();
        logger.info(parserResponse);

        numberOfCalls++;
      } catch (error) {
        logger.error('Parsing old months failed.', error);
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
    // todo: disable task if seeded, check first month in db
    seedOldMonthsTask.stop();
    logger.info(`seedOldMonthsTask stopped after numberOfCalls: ${numberOfCalls}`);
  }
};

export const logScheduledTasks = () =>
  logPrettyPrintObject(getScheduledTasksObject(), 'Scheduled tasks');

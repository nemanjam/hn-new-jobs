import cron from 'node-cron';

import logger from '@/libs/winston';

export const validateCronString = (cronString: string) => {
  const isValid = cron.validate(cronString);

  if (!isValid) {
    const message = `Invalid cronString: ${cronString}.`;

    logger.error(message);
    throw new Error(message);
  }
  return cronString;
};

export const getScheduledTasksObject = (): Record<string, { options: any }> => {
  const tasks = cron.getTasks();

  // keep only task.options
  const tasksObject = Object.fromEntries(
    Array.from(tasks.entries()).map(([key, value]) => [key, { options: (value as any).options }])
  );

  return tasksObject;
};

/** Runs only once on server start. */
export const register = async () => {
  // imports fail on return early
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // conditional imports
    const { logConfig } = await import('@/config/server');
    const { debuggingScheduler, newMonthScheduler, seedOldMonthsScheduler, logScheduledTasks } =
      await import('@/modules/scheduler/main');

    // debugging
    logConfig();
    debuggingScheduler();

    // main call
    newMonthScheduler();

    // seed
    seedOldMonthsScheduler();

    // must be at end
    logScheduledTasks();
  }
};

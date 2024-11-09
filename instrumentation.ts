/** Runs only once on server start. */
export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // conditional imports
    const { logConfig } = await import('@/config/parser');
    const { debuggingScheduler, newMonthScheduler, seedOldMonthsScheduler } = await import(
      '@/modules/scheduler/main'
    );

    // debugging
    logConfig();
    debuggingScheduler();

    // main call
    newMonthScheduler();

    // seed
    seedOldMonthsScheduler();
  }
};

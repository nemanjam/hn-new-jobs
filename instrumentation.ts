/** Runs only once on server start. */
export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // conditional imports
    const { logConfig } = await import('@/config/parser');
    const { initScheduler } = await import('@/modules/scheduler/main');

    // calls
    logConfig();
    initScheduler();
  }
};

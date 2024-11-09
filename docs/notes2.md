```ts
    test axios rate limit in practice // to
    support getThreads pagination // not needed 455 of 1000 threads

// fora sa sqlite, vraca projektovan objekat Pick<DbMonth, 'name'>
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name ASC LIMIT 1`).get();

cache duration
    parse entire history, scheduler, limit on number of calls
    idempotent retry new month
    new month should run every day between 1st and 15th in month, insert or update
    data folder must use volume for sqlite db and cache
    add api endpoints for cron
incremental static regeneration, invalidate after parseNewMonth
cache time for search thread and hiring thread?
logger instance with timestamp
```

cron debugging

ps aux | grep crond

cat /var/log/cron.log
ls -la /var/log/cron.log

cat /etc/crontab/nextjs
ls -la /etc/crontab/nextjs

node:x:1000:1000:Linux User,,,:/home/node:/bin/sh
nextjs:x:1001:65533:Linux User,,,:/home/nextjs:/sbin/nologin

cron -f

cant start cron in docker as non root user
setpgid: Operation not permitted

instrumentation.ts conditional import
https://github.com/vercel/next.js/issues/49565
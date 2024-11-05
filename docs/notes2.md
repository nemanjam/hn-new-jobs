```ts
test axios rate limit in practice // to
    support getThreads pagination // not needed 455 of 1000 threads

// fora sa sqlite, vraca projektovan objekat Pick<DbMonth, 'name'>
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name ASC LIMIT 1`).get();

cache duration
parse entire history, scheduler
idempotent retry new month
```
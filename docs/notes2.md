```ts
test axios rate limit in practice
support getThreads pagination

// fora sa sqlite, vraca projektovan objekat Pick<DbMonth, 'name'>
  // SELECT name FROM month projects just name, but still returns object { name }
  const firstMonth = db.prepare<[], Pick<DbMonth, 'name'>>(`SELECT name FROM month ORDER BY name ASC LIMIT 1`).get();
```
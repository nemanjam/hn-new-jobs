```ts
    record video demo
    database diagram
    fix bar chart 8-12
    fix first month exception
    add 404 and 500 page
    validate month in page params
winston singleton
case insensitive company name consensys

click up api

https://play.clickhouse.com/play?user=play#U0VMRUNUIG1heCh0aW1lKSBGUk9NIGhhY2tlcm5ld3NfaGlzdG9yeQ==
        lru cache
lighthouse in ssr section readme
need to restart container after cron new month, maybe cache or database volume 
jeste do cache, nema sa cache disabled
cache invalidate fails?
mozda samo portainer container recreate fails
----
N new ads since yesterday, both debugging and ui, compare last month updatedAt // dobar feature
deleteLastNMonths to debug updating
remove plausible proxy for country, open issue and ask
-----------------
first newer month, check db too, not latest
await getCacheDatabase().clear(); simply FAILS
after clear() doesnt work
----
cacheDatabaseWrapper() must accept keyv as arg, pass getCacheDatabase() every time
doesnt mutate
always has data from memory, get() has memory
const cachedResult = await getCacheDatabase().get<T>(key);
console.log('key', key, 'cachedResult', cachedResult);
if (cachedResult) return cachedResult;
// set() Stores a Promise
  const dbResult = func(...args);
  await getCacheDatabase().set(key, dbResult);
NIJE ISTI PROCESS u scheduler script, cli script, i u next.js page
cache.clear() zove u drugoj aplikaciji - procesu iako je isti import // glavna POENTA
event?
get number of months from db, check in next.js page and cache.clear() // to
compare cached number of months and db number of months
symmetric difference
let symDifference = arr1.filter(x => !arr2.includes(x))
                        .concat(arr2.filter(x => !arr1.includes(x)));
// https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
-----
add endpoint, webhook to trigger cache.clear(), like ISR, POST with arg, axios na localhost

// try this nextjs.config.mjs

async rewrites() {
  return [
    {
      source: '/proxy/*',
      headers: [
        { key: 'X-Forwarded-For', value: '{http-client-ip}' }
      ],
      destination: 'https://plausible.io/:path*',
    }
  ]
}
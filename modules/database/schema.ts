import BetterSqlite3 from 'better-sqlite3';

import { PARSER_CONFIG } from '@/config/parser';

import type { Database } from 'better-sqlite3';

const { databaseFilePath } = PARSER_CONFIG;

export const db: Database = new BetterSqlite3(databaseFilePath);

// todo: must invalidate cache for updatedAt

db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    threadId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- auto-populated
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated on creation
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    monthName TEXT,
    commentId TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name)
  );
`);

import BetterSqlite3 from 'better-sqlite3';

import { SERVER_CONFIG } from '@/config/server';

import type { Database } from 'better-sqlite3';

const { databaseFilePath } = SERVER_CONFIG;

export const db: Database = new BetterSqlite3(databaseFilePath);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY, -- "YYYY-MM" format for uniqueness
    threadId TEXT UNIQUE,
    createdAtOriginal DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- auto-populated
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- auto-populated on creation
  );

  CREATE TABLE IF NOT EXISTS company (
    name TEXT,
    monthName TEXT,
    commentId TEXT UNIQUE,
    createdAtOriginal DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (name, monthName),
    FOREIGN KEY (monthName) REFERENCES month(name) ON DELETE CASCADE
  );
`);

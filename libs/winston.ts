import pretty from 'pretty';
import winston, { format, transports } from 'winston';

import { getAppNow, humanFormat } from '@/libs/datetime';
import { SERVER_CONFIG } from '@/config/server';

import type { Logform, Logger } from 'winston';

const { combine, timestamp, colorize, printf } = format;

// ! because of this cant be used in config
const { nodeEnv, logFilePath } = SERVER_CONFIG;

const printContext = (meta: unknown, addNewline = true) =>
  meta && Object.keys(meta).length > 0
    ? `${addNewline ? '\n' : ''}LOG_CONTEXT: ${JSON.stringify(meta, null, 2)}`
    : '';

// todo: add tailwind css
const htmlFormat: Logform.Format = printf(({ timestamp, level, message, ...meta }) => {
  const metaString = printContext(meta, false);

  const htmlString = `<div class="log-entry">
    <span class="level">${level.toUpperCase()}</span>: 
    <span class="timestamp">${timestamp}</span> - 
    <span class="message">${message}</span>
    ${metaString ? `<span class="meta">${metaString}</span>` : ''}
  </div>`;

  return pretty(htmlString, { ocd: true });
});

const timestampWithTimezone: Logform.Format = timestamp({
  format: () => humanFormat(getAppNow()),
});

const consoleFormat: Logform.Format = printf(({ timestamp, level, message, ...meta }) => {
  return `${level} ${timestamp} - ${message}${printContext(meta)}`;
});

/**
 * important: must level.toUpperCase() before ANSI color codes in colorize
 * format(), not printf() from consoleFormat
 */
const uppercaseLevel = format((info: Logform.TransformableInfo) => {
  info.level = info.level.toUpperCase();
  return info;
})();

const consoleCombinedFormats: Logform.Format = combine(
  timestampWithTimezone,
  uppercaseLevel, // must be before colorize()
  colorize(),
  consoleFormat
);

const devLogger: Logger = winston.createLogger({
  level: 'debug',
  format: consoleCombinedFormats,
  transports: [new transports.Console()],
});

const prodLogger: Logger = winston.createLogger({
  level: 'info',
  transports: [
    new transports.Console({ format: consoleCombinedFormats }),
    new transports.File({
      filename: logFilePath,
      format: combine(timestampWithTimezone, htmlFormat),
      maxFiles: 2,
      /**
       * 1 line - 30 bytes
       * 1 page - 3kB
       */
      // ! creates new file, useless
      maxsize: 300, // 10kB max file size
    }),
  ],
});

const logger: Logger = nodeEnv === 'production' ? prodLogger : devLogger;

/**
 * @example logger.info('my message)
 */
export default logger;

// logger.info('my test message', { k: 999, yy: 777 });
// logger.info('second message');

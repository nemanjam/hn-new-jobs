import winston, { format, transports } from 'winston';

import { getAppNow, humanFormat } from '@/libs/datetime';
import { PARSER_CONFIG } from '@/config/parser';

import type { Logform, Logger } from 'winston';

const { combine, timestamp, colorize, printf } = format;

// ! because of this cant be used in config
const { nodeEnv, logFilePath } = PARSER_CONFIG;

// todo: add tailwind css
const htmlFormat: Logform.Format = printf(({ timestamp, level, message }) => {
  return `<div class="log-entry">
    <span class="level">${level.toUpperCase()}</span>: 
    <span class="timestamp">${timestamp}</span> - 
    <span class="message">${message}</span>
  </div>`;
});

const timestampWithTimezone: Logform.Format = timestamp({
  format: () => humanFormat(getAppNow()),
});

const consoleFormat: Logform.Format = printf(({ timestamp, level, message }) => {
  return `${level} ${timestamp} - ${message}`;
});

/**
 * impoortant: must level.toUpperCase() before ANSI color codes in colorize
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
      maxsize: 10 * 1024, // 10kB max file size
    }),
  ],
});

const logger: Logger = nodeEnv === 'production' ? prodLogger : devLogger;

/**
 * @example logger.info('my message)
 */
export default logger;

// todo: pass context object
logger.info('my test message', { k: 999, yy: 777 });

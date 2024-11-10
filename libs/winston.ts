import winston, { format, transports } from 'winston';

import { getAppNow, humanFormat } from '@/libs/datetime';
import { PARSER_CONFIG } from '@/config/parser';

import type { Logform, Logger } from 'winston';

const { nodeEnv, logFilePath } = PARSER_CONFIG;

const htmlFormat: Logform.Format = format.printf(({ timestamp, level, message }) => {
  return `<div class="log-entry">
    <span class="timestamp">${timestamp}</span> - 
    <span class="level">${level.toUpperCase()}</span>: 
    <span class="message">${message}</span>
  </div>`;
});

const consoleFormat: Logform.Format = format.printf(({ timestamp, level, message }) => {
  return `${level} ${timestamp} - ${message}`;
});

const timestampWithTimezone: Logform.Format = format.timestamp({
  format: () => humanFormat(getAppNow()),
});

const devLogger: Logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(timestampWithTimezone, winston.format.colorize(), consoleFormat),
  transports: [new transports.Console()],
});

const prodLogger: Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(timestampWithTimezone, consoleFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: logFilePath,
      format: winston.format.combine(timestampWithTimezone, htmlFormat),
      maxsize: 10 * 1024, // 10kB max file size
    }),
  ],
});

const logger: Logger = nodeEnv === 'production' ? prodLogger : devLogger;

/**
 * @example logger.info('my message)
 */
export default logger;

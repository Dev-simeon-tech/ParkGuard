import path from 'node:path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { envConfig } from '@/config';

const logsDir = path.resolve(process.cwd(), 'logs');

const winstonLogger = winston.createLogger({
  level: envConfig.app.isProd ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, context, stack, detail }) => {
      const tag = context ? `[${context}] ` : '';
      const cause = stack ?? detail;
      return `${timestamp} ${level.toUpperCase()} ${tag}${message}${cause ? `\n${cause}` : ''}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: logsDir,
      filename: 'ERROR_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '60d',
    }),
    new DailyRotateFile({
      dirname: logsDir,
      filename: 'INFO_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '60d',
    }),
  ],
});

export class Logger {
  constructor(private readonly context: string) {}

  debug(message: string, meta?: Record<string, unknown>) {
    winstonLogger.debug(message, { context: this.context, ...meta });
  }

  info(message: string, meta?: Record<string, unknown>) {
    winstonLogger.info(message, { context: this.context, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>) {
    winstonLogger.warn(message, { context: this.context, ...meta });
  }

  // winston's errors({ stack: true }) only unwraps an Error passed as the log
  // message itself — one nested in meta is dropped silently, which left every
  // error here printing with no cause. Lift it onto the fields printf reads
  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    let cause: Record<string, unknown> = {};
    if (error instanceof Error) {
      cause = { stack: error.stack ?? `${error.name}: ${error.message}` };
    } else if (error !== undefined) {
      cause = { detail: this.describe(error) };
    }
    winstonLogger.error(message, { context: this.context, ...cause, ...meta });
  }

  // Non-Error rejections are common (Resend returns a plain { name, message }
  // object), and String() turns those into a useless '[object Object]'
  private describe(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    try {
      return JSON.stringify(error) ?? String(error);
    } catch {
      return String(error);
    }
  }
}

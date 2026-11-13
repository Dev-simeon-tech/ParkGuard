import type { NextFunction, Request, Response } from 'express';
import { errorFormatter } from '@/common/utils/error-formatter';
import { Logger } from '@/common/utils/logger';
import { envConfig } from '@/config';

const logger = new Logger('ErrorHandler');

export function errorHandlerMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const response = errorFormatter(err, envConfig.app.isProd);

  if (response.error.statusCode >= 500) {
    logger.error(response.error.message, err, { errorId: response.error.id });
  }

  res.status(response.error.statusCode).json(response);
}

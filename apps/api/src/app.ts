import { API_VERSION } from '@parkguard/constants';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandlerMiddleware } from '@/common/middlewares/error-handler.middleware';
import { notFoundMiddleware } from '@/common/middlewares/not-found.middleware';
import { envConfig } from '@/config';
import { mainRouter } from '@/routes';

const JSON_BODY_LIMIT = '16mb';

export function initApp() {
  const app = express();

  const allowedOrigins = Object.values(envConfig.clientUrls);

  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));
  app.use(cookieParser());

  if (!envConfig.app.isTest) {
    app.use(morgan(envConfig.app.isDev ? 'dev' : 'combined'));
  }

  app.use(`/api/${API_VERSION}`, mainRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}

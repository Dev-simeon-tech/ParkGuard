import type { Server } from 'node:http';
import type { DataSource } from 'typeorm';
import { Logger } from '@/common/utils/logger';

const logger = new Logger('GracefulShutdown');

const SHUTDOWN_TIMEOUT_MS = 10_000;

export function registerGracefulShutdown(server: Server, dataSource: DataSource) {
  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    const forceExit = setTimeout(() => {
      logger.error('Graceful shutdown timed out, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server', err);
      }

      try {
        await dataSource.destroy();
        logger.info('Database connection closed');
      } catch (error) {
        logger.error('Error closing database connection', error);
      }

      clearTimeout(forceExit);
      process.exit(0);
    });
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

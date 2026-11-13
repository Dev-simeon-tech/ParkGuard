import 'reflect-metadata';
import { initApp } from '@/app';
import { registerGracefulShutdown } from '@/common/utils/graceful-shutdown';
import { Logger } from '@/common/utils/logger';
import { envConfig } from '@/config';
import { AppDataSource, initDbConnection, syncRolesAndPermissions } from '@/db';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  await initDbConnection();
  await syncRolesAndPermissions();

  const app = initApp();

  const server = app.listen(envConfig.app.port, () => {
    logger.info(`Server listening on port ${envConfig.app.port}`);
  });

  registerGracefulShutdown(server, AppDataSource);
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});

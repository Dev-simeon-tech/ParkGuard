import { Logger } from '@/common/utils/logger';
import { AppDataSource } from './data-source';

const logger = new Logger('Database');

export async function initDbConnection() {
  await AppDataSource.initialize();
  logger.info('Database connection established');
}

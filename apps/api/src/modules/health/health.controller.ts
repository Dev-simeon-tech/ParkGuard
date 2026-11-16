import type { Request, Response } from 'express';
import { Logger } from '@/common/utils/logger';
import { HealthService } from './health.service';

export class HealthController {
  private readonly service = new HealthService();
  private readonly logger = new Logger(HealthController.name);

  check = async (_req: Request, res: Response) => {
    const result = this.service.check();
    this.logger.debug('health check requested');
    res.json(result);
  };
}

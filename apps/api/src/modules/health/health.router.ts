import { Router } from 'express';
import { HealthController } from './health.controller';

const controller = new HealthController();

export const router = Router();

router.get('/', controller.check);

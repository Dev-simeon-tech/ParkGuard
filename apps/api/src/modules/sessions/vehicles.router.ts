import { PermissionSets } from '@parkguard/authorization';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { requirePermission } from '@/common/middlewares/permission.middleware';
import { tenantGuard } from '@/common/middlewares/tenant.middleware';
import { validationMiddleware } from '@/common/middlewares/validation.middleware';
import { SessionsController } from './sessions.controller';

const controller = new SessionsController();

export const router = Router();

router.use(authMiddleware, tenantGuard);

const VehicleParamsSchema = z.object({ id: z.uuid() });
const VehicleQuerySchema = z.object({ search: z.string().optional() });

router.get(
  '/',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ query: VehicleQuerySchema }),
  controller.listVehicles,
);

router.get(
  '/:id',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ params: VehicleParamsSchema }),
  controller.getVehicle,
);

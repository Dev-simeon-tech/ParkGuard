import { PermissionSets } from '@parkguard/authorization';
import { CreateBranchBodySchema, UpdateBranchBodySchema } from '@parkguard/schemas';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { requirePermission } from '@/common/middlewares/permission.middleware';
import { tenantGuard } from '@/common/middlewares/tenant.middleware';
import { validationMiddleware } from '@/common/middlewares/validation.middleware';
import { requireVerifiedEmail } from '@/common/middlewares/verified-email.middleware';
import { BranchesController } from './branches.controller';

const controller = new BranchesController();

export const router = Router();

router.use(authMiddleware, tenantGuard);

const BranchParamsSchema = z.object({ id: z.uuid() });

router.post(
  '/',
  requireVerifiedEmail,
  requirePermission(PermissionSets.branches.MANAGE),
  validationMiddleware({ body: CreateBranchBodySchema }),
  controller.createBranch,
);

router.get('/', requirePermission(PermissionSets.branches.VIEW), controller.listBranches);

router.get(
  '/:id',
  requirePermission(PermissionSets.branches.VIEW),
  validationMiddleware({ params: BranchParamsSchema }),
  controller.getBranch,
);

router.patch(
  '/:id',
  requireVerifiedEmail,
  requirePermission(PermissionSets.branches.MANAGE),
  validationMiddleware({ params: BranchParamsSchema, body: UpdateBranchBodySchema }),
  controller.updateBranch,
);

router.post(
  '/:id/disable',
  requireVerifiedEmail,
  requirePermission(PermissionSets.branches.MANAGE),
  validationMiddleware({ params: BranchParamsSchema }),
  controller.disableBranch,
);

router.post(
  '/:id/enable',
  requireVerifiedEmail,
  requirePermission(PermissionSets.branches.MANAGE),
  validationMiddleware({ params: BranchParamsSchema }),
  controller.enableBranch,
);

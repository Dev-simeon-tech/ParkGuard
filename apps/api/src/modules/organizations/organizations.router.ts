import { PermissionSets } from '@parkguard/authorization';
import {
  AcceptInviteBodySchema,
  InviteMemberBodySchema,
  UpdateEmployeeBodySchema,
} from '@parkguard/schemas';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { requirePermission } from '@/common/middlewares/permission.middleware';
import { tenantGuard } from '@/common/middlewares/tenant.middleware';
import { validationMiddleware } from '@/common/middlewares/validation.middleware';
import { requireVerifiedEmail } from '@/common/middlewares/verified-email.middleware';
import { OrganizationsController } from './organizations.controller';

const controller = new OrganizationsController();

export const router = Router();

const EmployeeParamsSchema = z.object({ id: z.uuid() });

router.post(
  '/invitations',
  authMiddleware,
  requireVerifiedEmail,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  validationMiddleware({ body: InviteMemberBodySchema }),
  controller.inviteMember,
);

router.get(
  '/invitations/verify',
  validationMiddleware({ query: z.object({ token: z.string().min(1) }) }),
  controller.verifyInvite,
);

router.post(
  '/invitations/accept',
  validationMiddleware({ body: AcceptInviteBodySchema }),
  controller.acceptInvite,
);

router.get(
  '/roles',
  authMiddleware,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  controller.listRoles,
);

router.get(
  '/employees',
  authMiddleware,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  controller.listEmployees,
);

router.patch(
  '/employees/:id',
  authMiddleware,
  requireVerifiedEmail,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  validationMiddleware({ params: EmployeeParamsSchema, body: UpdateEmployeeBodySchema }),
  controller.updateEmployee,
);

router.post(
  '/employees/:id/disable',
  authMiddleware,
  requireVerifiedEmail,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  validationMiddleware({ params: EmployeeParamsSchema }),
  controller.disableEmployee,
);

router.post(
  '/employees/:id/enable',
  authMiddleware,
  requireVerifiedEmail,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  validationMiddleware({ params: EmployeeParamsSchema }),
  controller.enableEmployee,
);

router.delete(
  '/employees/:id',
  authMiddleware,
  requireVerifiedEmail,
  tenantGuard,
  requirePermission(PermissionSets.organization.MANAGE_MEMBERS),
  validationMiddleware({ params: EmployeeParamsSchema }),
  controller.removeEmployee,
);

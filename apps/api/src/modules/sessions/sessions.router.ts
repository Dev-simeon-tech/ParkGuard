import { PermissionSets } from '@parkguard/authorization';
import {
  CloseSessionBodySchema,
  CreateSessionBodySchema,
  ListSessionsQuerySchema,
  RecognizeSessionBodySchema,
} from '@parkguard/schemas';
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { requirePermission } from '@/common/middlewares/permission.middleware';
import { tenantGuard } from '@/common/middlewares/tenant.middleware';
import { validationMiddleware } from '@/common/middlewares/validation.middleware';
import { requireVerifiedEmail } from '@/common/middlewares/verified-email.middleware';
import { SessionsController } from './sessions.controller';

const controller = new SessionsController();

export const router = Router();

router.use(authMiddleware, tenantGuard);

const SessionParamsSchema = z.object({ id: z.uuid() });
const SessionPhotoParamsSchema = z.object({ id: z.uuid(), type: z.enum(['entry', 'exit']) });
const SessionAnalyticsQuerySchema = z.object({ date: z.iso.date() });
const AttendantSessionAnalyticsQuerySchema = z.object({
  date: z.iso.date(),
  userId: z.uuid(),
});

router.post(
  '/recognize',
  requireVerifiedEmail,
  requirePermission(PermissionSets.sessions.MANAGE),
  validationMiddleware({ body: RecognizeSessionBodySchema }),
  controller.recognize,
);

router.post(
  '/recognise-by-plate',
  requireVerifiedEmail,
  requirePermission(PermissionSets.sessions.MANAGE),
  validationMiddleware({ body: z.object({ plateNumber: z.string(), branchId: z.uuid() }) }),
  controller.recogniseByPlate,
);

router.post(
  '/',
  requireVerifiedEmail,
  requirePermission(PermissionSets.sessions.MANAGE),
  validationMiddleware({ body: CreateSessionBodySchema }),
  controller.createSession,
);

router.get(
  '/',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ query: ListSessionsQuerySchema }),
  controller.listSessions,
);

router.get(
  '/analytics',
  validationMiddleware({ query: SessionAnalyticsQuerySchema }),
  controller.getAnalytics,
);

router.get(
  '/revenue/',
  requirePermission(PermissionSets.revenue.MANAGE),
  validationMiddleware({ query: SessionAnalyticsQuerySchema }),
  controller.getRevenueAnalytics,
);

router.get(
  '/analytics/attendant',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ query: AttendantSessionAnalyticsQuerySchema }),
  controller.getAttendantAnalytics,
);

router.get(
  '/:id',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ params: SessionParamsSchema }),
  controller.getSession,
);

router.get(
  '/:id/photo/:type',
  requirePermission(PermissionSets.sessions.VIEW),
  validationMiddleware({ params: SessionPhotoParamsSchema }),
  controller.getSessionPhoto,
);

router.post(
  '/:id/close',
  requireVerifiedEmail,
  requirePermission(PermissionSets.sessions.MANAGE),
  validationMiddleware({ params: SessionParamsSchema, body: CloseSessionBodySchema }),
  controller.closeSession,
);

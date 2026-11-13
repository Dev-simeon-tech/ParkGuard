import { Router } from 'express';
import { router as authRouter } from '@/modules/auth/auth.router';
import { router as healthRouter } from '@/modules/health/health.router';
import { router as organizationsRouter } from '@/modules/organizations/organizations.router';
import { router as usersRouter } from '@/modules/users/users.router';

export const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/organizations', organizationsRouter);
mainRouter.use('/users', usersRouter);

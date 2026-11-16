import { Router } from 'express';
import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { UsersController } from './users.controller';

const controller = new UsersController();

export const router = Router();

router.get('/me', authMiddleware, controller.me);

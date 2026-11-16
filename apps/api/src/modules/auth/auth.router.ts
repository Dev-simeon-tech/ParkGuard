import {
  ForgotPasswordBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  ResendVerificationBodySchema,
  ResetPasswordBodySchema,
} from '@parkguard/schemas';
import { Router } from 'express';
import { z } from 'zod';
import { validationMiddleware } from '@/common/middlewares/validation.middleware';
import { AuthController } from './auth.controller';

const controller = new AuthController();

export const router = Router();

const RefreshTokenBodySchema = z.object({ refreshToken: z.string().optional() });

router.post('/register', validationMiddleware({ body: RegisterBodySchema }), controller.register);
router.post('/login', validationMiddleware({ body: LoginBodySchema }), controller.login);
router.post('/refresh', validationMiddleware({ body: RefreshTokenBodySchema }), controller.refresh);
router.post('/logout', validationMiddleware({ body: RefreshTokenBodySchema }), controller.logout);
router.get(
  '/verify-email',
  validationMiddleware({ query: z.object({ token: z.string().min(1) }) }),
  controller.verifyEmail,
);
router.post(
  '/resend-verification',
  validationMiddleware({ body: ResendVerificationBodySchema }),
  controller.resendVerification,
);
router.post(
  '/forgot-password',
  validationMiddleware({ body: ForgotPasswordBodySchema }),
  controller.forgotPassword,
);
router.get(
  '/reset-password/verify',
  validationMiddleware({ query: z.object({ token: z.string().min(1) }) }),
  controller.verifyResetPasswordToken,
);
router.post(
  '/reset-password',
  validationMiddleware({ body: ResetPasswordBodySchema }),
  controller.resetPassword,
);

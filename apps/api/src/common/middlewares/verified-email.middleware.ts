import type { NextFunction, Request, Response } from 'express';
import { ForbiddenException, UnauthorizedException } from '@/common/exceptions';
import { UserEntity } from '@/db/entities';

export async function requireVerifiedEmail(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new UnauthorizedException('Not authenticated'));
    return;
  }

  const user = await UserEntity.findOneBy({ id: req.user.userId });
  if (!user?.emailVerifiedAt) {
    next(new ForbiddenException('Please verify your email address first'));
    return;
  }

  next();
}

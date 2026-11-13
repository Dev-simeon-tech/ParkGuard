import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '@/common/exceptions';
import { verifyAccessToken } from '@/lib/jwt';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new UnauthorizedException('Missing access token'));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedException('Invalid or expired access token'));
  }
}

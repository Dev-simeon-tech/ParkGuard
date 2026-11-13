import type { Request, Response } from 'express';
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
  setRefreshTokenCookie,
} from '@/common/utils/auth-cookie';
import { buildAuthResponse } from '@/common/utils/build-auth-response';
import { AuthMessages } from './auth.messages';
import { AuthService } from './auth.service';

export class AuthController {
  private readonly service = new AuthService();

  register = async (req: Request, res: Response) => {
    const result = await this.service.register(req.body);
    setRefreshTokenCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
    res.status(201).json(await buildAuthResponse(result));
  };

  login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body);
    setRefreshTokenCookie(res, result.refreshToken, result.refreshTokenExpiresAt);
    res.json(await buildAuthResponse(result));
  };

  refresh = async (req: Request, res: Response) => {
    const token = getRefreshTokenFromRequest(req);
    const result = await this.service.refreshAccessToken(token);
    res.json(await buildAuthResponse(result));
  };

  logout = async (req: Request, res: Response) => {
    const token = getRefreshTokenFromRequest(req);
    await this.service.logout(token);
    clearRefreshTokenCookie(res);
    res.status(204).send();
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    await this.service.verifyEmail(token);
    res.json({ message: AuthMessages.EMAIL_VERIFIED });
  };

  resendVerification = async (req: Request, res: Response) => {
    await this.service.resendVerificationEmail(req.body.email);
    res.json({ message: AuthMessages.VERIFICATION_EMAIL_SENT });
  };

  forgotPassword = async (req: Request, res: Response) => {
    await this.service.forgotPassword(req.body.email);
    res.json({ message: AuthMessages.PASSWORD_RESET_LINK_SENT });
  };

  verifyResetPasswordToken = async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    const info = await this.service.verifyPasswordResetToken(token);
    res.json(info);
  };

  resetPassword = async (req: Request, res: Response) => {
    await this.service.resetPassword(req.body);
    res.json({ message: AuthMessages.PASSWORD_RESET_SUCCESS });
  };
}

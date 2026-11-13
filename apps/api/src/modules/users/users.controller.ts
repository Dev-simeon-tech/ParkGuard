import type { Request, Response } from 'express';
import { buildUserContextResponse } from '@/common/utils/build-auth-response';
import { UsersService } from './users.service';

export class UsersController {
  private readonly service = new UsersService();

  me = async (req: Request, res: Response) => {
    const user = await this.service.getMe(req.user!.userId);
    res.json(await buildUserContextResponse(user));
  };
}

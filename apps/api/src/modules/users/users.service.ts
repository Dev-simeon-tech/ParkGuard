import { UserEntity } from '@/db/entities';

export class UsersService {
  async getMe(userId: string): Promise<UserEntity> {
    return UserEntity.findOneByOrFail({ id: userId });
  }
}

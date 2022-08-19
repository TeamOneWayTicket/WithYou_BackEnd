import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserPushToken } from './entity/user-push-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPushTokenService {
  constructor(
    @InjectRepository(UserPushToken)
    private readonly userPushTokenRepository: Repository<UserPushToken>,
  ) {}

  async findPushTokenByUserId(userId: number) {
    return await this.userPushTokenRepository.findOne({
      where: {
        userId,
      },
    });
  }
}

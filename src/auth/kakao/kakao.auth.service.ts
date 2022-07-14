import { Injectable } from '@nestjs/common';
import { KakaoUser } from '../../user/kakao.user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';

@Injectable()
export class KakaoAuthService {
  constructor(
    @InjectRepository(KakaoUser)
    private kakaoUserRepository: Repository<KakaoUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findKakaoUser(kakaoId: string): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { kakaoId },
    });
  }

  async register(
    kakaoId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<KakaoUser> {
    const user = {} as User;
    await this.userRepository.save(user);
    return await this.kakaoUserRepository.save({
      user: user,
      userId: user.id,
      accessToken: accessToken,
      kakaoId: kakaoId,
      refreshToken: refreshToken,
    });
  }

  async updateUser(user: KakaoUser): Promise<KakaoUser> {
    const targetUser: KakaoUser = await this.findKakaoUser(user.kakaoId);
    const updatedUser: KakaoUser = {
      id: targetUser.id,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      kakaoId: user.kakaoId,
      userId: targetUser.userId,
      user: targetUser.user,
    };

    await this.kakaoUserRepository.update(targetUser.id, updatedUser);
    return targetUser;
  }

  async login(user: KakaoUser): Promise<KakaoUser> {
    const existUser: KakaoUser = await this.validateUser(user.kakaoId);

    if (!existUser) {
      return this.register(user.kakaoId, user.accessToken, user.refreshToken);
    } else {
      return this.updateUser(user);
    }
  }

  async validateUser(kakaoId: string): Promise<KakaoUser> {
    return await this.findKakaoUser(kakaoId);
  }
}

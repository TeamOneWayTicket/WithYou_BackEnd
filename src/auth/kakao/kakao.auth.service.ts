import { Injectable } from '@nestjs/common';
import { KakaoUser } from '../../user/kakao.user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { async } from 'rxjs';

@Injectable()
export class KakaoAuthService {
  constructor(
    @InjectRepository(KakaoUser)
    private kakaoUserRepository: Repository<KakaoUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private myDataSource: DataSource,
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
    const queryRunner = this.myDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = {} as User;
    let kakaoUser: KakaoUser;
    try {
      await this.userRepository.save(user);
      kakaoUser = await this.kakaoUserRepository.save({
        user: user,
        userId: user.id,
        accessToken: accessToken,
        kakaoId: kakaoId,
        refreshToken: refreshToken,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return kakaoUser;
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

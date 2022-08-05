import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { KakaoUser } from '../../user/kakao.user.entity';
import { User } from '../../user/user.entity';
import axios from 'axios';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class KakaoAuthService {
  constructor(
    @InjectRepository(KakaoUser)
    private kakaoUserRepository: Repository<KakaoUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private myDataSource: DataSource,
    private configService: ApiConfigService,
  ) {}

  async findKakaoUser(kakaoId: string): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { kakaoId },
    });
  }

  async findKakaoUserByUserId(userId: number): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { userId },
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
        userId: user.id,
        accessToken,
        kakaoId,
        refreshToken,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return kakaoUser;
  }

  async updateUser(_user: KakaoUser): Promise<KakaoUser> {
    const targetUser: KakaoUser = await this.findKakaoUser(_user.kakaoId);
    const { id, userId, user } = targetUser;
    const { accessToken, refreshToken, kakaoId } = _user;
    const updatedUser: KakaoUser = {
      id,
      accessToken,
      refreshToken,
      kakaoId,
      userId,
      user,
    };

    await this.kakaoUserRepository.update(targetUser.id, updatedUser);
    return updatedUser;
  }

  async login(user: KakaoUser): Promise<KakaoUser> {
    const existUser: KakaoUser = await this.findKakaoUser(user.kakaoId);

    if (!existUser) {
      return this.register(user.kakaoId, user.accessToken, user.refreshToken);
    } else {
      return this.updateUser(user);
    }
  }

  async renewToken(kakaoUser: KakaoUser) {
    try {
      const _hostName = 'https://kauth.kakao.com/oauth/token';
      const res = await axios({
        method: 'get',
        url: _hostName,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        data: {
          grant_type: 'refresh_token',
          client_id: this.configService.kakaoConfig.restApiKey,
          refresh_token: kakaoUser.refreshToken,
        },
      });
      console.log('kakao.auth.service', res);
    } catch (error) {
      console.error(error);
    }
  }
}

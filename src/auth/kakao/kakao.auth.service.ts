import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { KakaoUser } from '../../user/kakao.user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KakaoAuthService {
  check: boolean;
  accessToken: string;
  private http: HttpService;
  constructor(
    @InjectRepository(KakaoUser)
    private kakaoUserRepository: Repository<KakaoUser>,
  ) {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
  }

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
    return await this.kakaoUserRepository.save({
      accessToken: accessToken,
      kakaoId: kakaoId,
      refreshToken: refreshToken,
    });
  }

  async updateUser(user: KakaoUser): Promise<KakaoUser> {
    const targetUser: KakaoUser = await this.findKakaoUser(user.kakaoId);
    const updatedUser: KakaoUser = {
      kakaoUserId: targetUser.kakaoUserId,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      kakaoId: user.kakaoId,
      userId: targetUser.userId,
      user: targetUser.user,
    };

    await this.kakaoUserRepository.update(targetUser.kakaoUserId, updatedUser);
    return targetUser;
  }

  async login(user: KakaoUser): Promise<KakaoUser> {
    const existUser = this.validateUser(user.kakaoId);

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

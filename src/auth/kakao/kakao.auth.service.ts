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
      where: { kakaoId: kakaoId },
    });
  }

  async login(
    accessToken: string,
    refreshToken: string,
    kakaoId: string,
  ): Promise<KakaoUser> {
    const kakaoUser = new KakaoUser();
    kakaoUser.accessToken = accessToken;
    kakaoUser.kakaoId = kakaoId;
    kakaoUser.refreshToken = refreshToken;

    return await this.kakaoUserRepository.save(kakaoUser);
  }

  async logout(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/logout';
    const _headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    console.log(this.accessToken);
    //console.log(JSON.stringify(_headers));
    return await lastValueFrom(this.http.post(_url, '', { headers: _headers }));
  }

  async deleteLog(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await lastValueFrom(this.http.post(_url, '', { headers: _headers }));
  }

  async validateUser(kakaoId: string): Promise<KakaoUser> {
    return await this.findKakaoUser(kakaoId);
  }
}

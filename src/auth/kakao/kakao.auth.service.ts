import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { KakaoUser } from '../../user/kakao.user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { exists } from 'fs';

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

  async register(
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

  async getToken(
    _restApiKey: string,
    _redirectUrl: string,
    code: string,
  ): Promise<any> {
    const hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&code=${code}`;
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    return await lastValueFrom(this.http.post(hostName, '', headers));
  }

  async getUserInfo(accessToken: string) {
    //GET요청을 보내기 위해 필요한 정보들
    const url = 'https://kapi.kakao.com/v2/user/me';
    // console.log(res);
    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return await lastValueFrom(this.http.get(url, headers));
  }

  setToken(token: string): boolean {
    this.accessToken = token;
    return true;
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

  async updateToken(
    accessToken: string,
    refreshToken: string,
    kakaoId: string,
  ) {
    const kakaoUser = await this.findKakaoUser(kakaoId);
    kakaoUser.accessToken = accessToken;
    kakaoUser.refreshToken = refreshToken;
    await this.kakaoUserRepository.update(kakaoUser.kakaoUserid, kakaoUser);
  }
}

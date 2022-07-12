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

  async login(url: string, headers: any): Promise<any> {
    return await lastValueFrom(this.http.post(url, '', { headers }));
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

  async showUserInfo(url: string, headers: any): Promise<any> {
    console.log(`헤더: ${JSON.stringify(headers.headers)}`);
    return await lastValueFrom(this.http.get(url, { headers }));
  }

  async getUserInfoByToken(accessToken: string): Promise<KakaoUser> {
    const _url = 'https://kapi.kakao.com/v2/user/me';
    // console.log(res);
    const _headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // console.log(`토큰: ${res.access_token}`)
    const kakaoUser = new KakaoUser();

    this.showUserInfo(_url, _headers.headers)
      .then((e) => {
        console.log(e);
        kakaoUser.kakaoId = e.data.id;
      })
      .catch((err) => {
        console.log(err);
      });

    return kakaoUser;
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

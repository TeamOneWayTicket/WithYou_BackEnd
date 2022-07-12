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

  loginCheck(): void {
    this.check = !this.check;
    return;
  }

  async findKakaoUser(kakaoId: string): Promise<KakaoUser> {
    return await this.kakaoUserRepository.findOne({
      where: { kakaoId: kakaoId },
    });
  }

  async register(token: string, kakaoAccountInfo: any): Promise<KakaoUser> {
    const kakaoUser = new KakaoUser();
    kakaoUser.accessToken = token;
    kakaoUser.kakaoId = kakaoAccountInfo.id;

    const existUser = await this.findKakaoUser(kakaoUser.kakaoId);

    if (existUser) {
      await this.kakaoUserRepository.update(existUser.kakaoUserid, kakaoUser);
      return existUser;
    } else {
      return await this.kakaoUserRepository.save(kakaoUser);
    }
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

  async deleteLog(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await lastValueFrom(this.http.post(_url, '', { headers: _headers }));
  }
}

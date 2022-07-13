import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { KakaoAuthService } from '../kakao/kakao.auth.service';
import { KakaoUser } from '../../user/kakao.user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,
    private kakaoAuthService: KakaoAuthService,
  ) {
    super({
      clientID: configService.kakaoConfig.restapiKey,
      callbackURL: configService.kakaoConfig.callbackUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // 유저가 이미 가입되어 있는지 검사
    const profileJson = profile._json;
    const kakaoId = profileJson.id;
    const user_email = profile._json.kakao_account.email;
    const user_nick = profile._json.properties.nickname;
    console.log('kakaoGuard start');
    console.log('accessToken: ' + accessToken);
    console.log('refreshToken: ' + refreshToken);
    console.log('profile: ' + profile);
    console.log('done: ' + done);
    console.log(kakaoId + ' ' + user_email + ' ' + user_nick);
    try {
      const user = await this.kakaoAuthService.validateUser(kakaoId);

      if (!user) {
        // 유저가 없을때 회원가입시키기
        const newUser = await this.kakaoAuthService.register(
          accessToken,
          refreshToken,
          kakaoId,
        );
        done(null, newUser);
      } else {
        // 유저가 있을때 token 갱신?
        // await this.kakaoAuthService.updateToken(
        //   accessToken,
        //   refreshToken,
        //   kakaoId,
        // );
        done(null, user);
      }
    } catch (error) {
      console.log(error);
      done(error);
    }

    //return { accessToken, refreshToken, type: 'login' };
  }
}

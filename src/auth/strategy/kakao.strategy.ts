import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ApiConfigService } from '../../shared/services/api-config.service';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ApiConfigService) {
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
    const user_email = profile._json.kakao_account.email;
    const user_nick = profile._json.properties.nickname;
    const user_provider = profile.provider;
    const user_profile = {
      user_email,
      user_nick,
      user_provider,
    };

    // const user = await this.authService.validateUser(user_email);
    //
    // if (user === null) {
    //   // 유저가 없을때
    //   console.log('일회용 토큰 발급');
    //   const once_token = this.authService.onceToken(user_profile);
    //   return { once_token, type: 'once' };
    // }
    //
    // // 유저가 있을때
    // console.log('로그인 토큰 발급');
    // const access_token = await this.authService.createLoginToken(user);
    // const refresh_token = await this.authService.createRefreshToken(user);
    // return { access_token, refresh_token, type: 'login' };
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      clientID: configService.kakaoConfig.restApiKey,
      callbackURL: configService.kakaoConfig.loginRedirectUrl,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: object,
    done: any,
  ) {
    const profileJson = profile['_json'];
    const kakaoId = profileJson.id;
    try {
      const user: {
        accessToken;
        kakaoId;
        refreshToken;
      } = {
        accessToken,
        refreshToken,
        kakaoId,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

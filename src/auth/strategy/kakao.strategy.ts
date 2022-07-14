import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ApiConfigService) {
    super({
      clientID: configService.kakaoConfig.restApiKey,
      callbackURL: configService.kakaoConfig.callBackUrl,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    // 유저가 이미 가입되어 있는지 검사

    const profileJson = profile._json;
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
      console.log(error);
      done(error);
    }
  }
}

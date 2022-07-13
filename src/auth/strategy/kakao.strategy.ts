import { PassportStrategy } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';

@Injectable()
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
    // 유저가 이미 가입되어 있는지 검사
    const profileJson = profile._json;
    const kakaoId = profileJson.id;
    try {
      const user: {
        accessToken: string;
        kakaoId: string;
        refreshToken: string;
      } = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        kakaoId: kakaoId,
      };
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
}

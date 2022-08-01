import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt.token.payload';
import { UserService } from '../../user/user.service';
import { KakaoAuthService } from '../kakao/kakao.auth.service';
import { GoogleAuthService } from '../google/google.auth.service';
import { User } from '../../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.authConfig.privateKey,
    });
  }
  async validate(
    payload: JwtTokenPayload,
  ): Promise<{ accessToken: string | undefined }> {
    // if (payload.userType === 'kakao') {
    //   const socialUser = await this.kakaoAuthService.findKakaoUser(
    //     payload.userId,
    //   );
    //   return this.userService.findOne(socialUser.userId);
    // } else if (payload.userType === 'google') {
    //   const socialUser = await this.googleAuthService.findGoogleUser(
    //     payload.userId,
    //   );
    //   return this.userService.findOne(socialUser.userId);
    // } else if (payload.userType === 'apple') {
    // } else {
    // }
  }
}

import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt.token.payload';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
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
    done: VerifiedCallback,
  ): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    console.log('jwt전략 시동');
    if (!user) {
      return done(
        new UnauthorizedException({ message: 'user does not exist' }),
      );
    }
    return done(null, user);
  }
}

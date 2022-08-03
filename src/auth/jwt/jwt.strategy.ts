import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { JwtTokenPayload } from './jwt.token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.secretkey,
    });
  }
}

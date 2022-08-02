import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '../../shared/services/api-config.service';
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.secretkey,
    });
  }
  async validate(payload): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    console.log('jwt전략 시동');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

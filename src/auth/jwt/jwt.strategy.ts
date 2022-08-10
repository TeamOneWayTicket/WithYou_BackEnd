import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtTokenResponseDto } from '../authDto/jwt-token-response.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.secretkey,
    });
  }

  async validate(payload: JwtTokenResponseDto) {
    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      throw new HttpException('유효하지 않은 유저입니다.', 401);
    }
    return payload;
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entity/user.entity';
import { JwtContentDto } from '../dto/jwt-content.dto';

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

  async validate(dto: JwtContentDto): Promise<User> {
    const user = await this.userService.findOne(dto.id);
    if (!user) {
      throw new HttpException('유효하지 않은 유저입니다.', 401);
    }
    return user;
  }
}

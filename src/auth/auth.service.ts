import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async tokenValidateUser(payload: JwtTokenPayload): Promise<User> {
    console.log('tokenValidate');
    return await this.userService.findOne(payload.userId);
  }

  async login(payload: JwtTokenPayload): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

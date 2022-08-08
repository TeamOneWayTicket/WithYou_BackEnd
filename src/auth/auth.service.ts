import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenResponse } from './auth.DTO/jwtTokenResponse';
import { JwtAccessTokenResponse } from './auth.DTO/jwtAccessTokenResponse';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async findUser(user: JwtTokenResponse): Promise<User> {
    return await this.userService.findOne(user.userId);
  }

  async getJwtToken(payload: JwtTokenPayload): Promise<JwtAccessTokenResponse> {
    return {
      accessToken: this.jwtService.sign(payload),
    } as JwtAccessTokenResponse;
  }

  async validateJwtToken(jwtToken: JwtAccessTokenResponse) {
    return await this.jwtService.verify(jwtToken.accessToken);
  }
}

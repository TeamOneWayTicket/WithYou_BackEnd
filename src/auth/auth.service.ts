import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from './auth.DTO/jwtResponse';

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

  async getJwtToken(payload: JwtTokenPayload): Promise<JwtResponse> {
    return { accessToken: this.jwtService.sign(payload) } as JwtResponse;
  }
}

import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getJwtToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUserInfo(id: number): Promise<boolean> {
    return !(await this.userService.hasMinimumInfo(id));
  }
}

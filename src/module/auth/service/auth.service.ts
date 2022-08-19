import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { JwtPayload } from '../interface/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }
}

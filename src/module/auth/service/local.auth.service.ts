import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { JwtPayload } from '../interface/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/service/user.service';

@Injectable()
export class LocalAuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
}

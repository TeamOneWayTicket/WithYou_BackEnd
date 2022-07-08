import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';
import { validateHash } from '../common/utils';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async validateUser(userEmail: string): Promise<User> {
    const user = await this.userService.findOneByEmail(userEmail);

    console.log('유저 검증 in auth.service');
    console.log(userEmail);
    console.log(user.userPassword);

    return user!;
  }
}

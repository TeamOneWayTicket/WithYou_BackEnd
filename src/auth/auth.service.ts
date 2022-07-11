import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async validateUser(userid: number): Promise<User> {
    const user = await this.userService.findOne(userid);

    console.log('유저 검증 in auth.service');
    console.log(userid);

    return user!;
  }
}

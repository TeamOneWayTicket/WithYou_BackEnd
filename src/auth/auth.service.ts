import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ApiConfigService } from '../shared/services/api-config.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async validateUser(userid: number): Promise<User> {
    return await this.userService.findOne(userid);
  }
}

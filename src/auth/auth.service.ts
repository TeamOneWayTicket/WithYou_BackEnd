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

  async validateUser(userId: string, userPassword: string): Promise<User> {
    const user = await this.userService.findOneByUserId(userId);

    console.log('유저 검증 in auth.service');
    console.log(userPassword);
    console.log(user.userPassword);

    // const isPasswordValid = await validateHash(
    //   userPassword,
    //   user?.userPassword,
    // );

    if (userPassword !== user.userPassword) {
      console.log('비밀번호 불일치');
      throw new NotFoundException();
    }

    return user!;
  }
}

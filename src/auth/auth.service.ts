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

  // async createAccessToken(data: {
  //   role: RoleType;
  //   userId: Uuid;
  // }): Promise<TokenPayloadDto> {
  //   return new TokenPayloadDto({
  //     expiresIn: this.configService.authConfig.jwtExpirationTime,
  //     accessToken: await this.jwtService.signAsync({
  //       userId: data.userId,
  //       type: TokenType.ACCESS_TOKEN,
  //       role: data.role,
  //     }),
  //   });
  // }

  async validateUser(userId: string, userPassword: string): Promise<User> {
    const user = await this.userService.findOneByUserId(userId);

    console.log('유저 검증 in auth.service');
    const isPasswordValid = await validateHash(
      userPassword,
      user?.userPassword,
    );

    if (!isPasswordValid) {
      throw new NotFoundException();
    }

    return user!;
  }
}

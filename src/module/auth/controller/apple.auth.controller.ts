import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { AuthService } from '../service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppleAuthService } from '../service/apple.auth.service';
import { AppleTokenDto } from '../dto/apple-token.dto';
import verifyAppleToken from 'verify-apple-id-token';

@Controller('auth/apple')
export class AppleAuthController {
  constructor(
    private readonly appleAuthService: AppleAuthService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/callback')
  @ApiOperation({
    summary: 'apple login callback',
    description: 'apple idToken 받아 jwt 토큰 발급',
  })
  async callback(dto: AppleTokenDto): Promise<JwtResponseDto> {
    const jwtClaims = await verifyAppleToken({
      idToken: dto.accessToken,
      clientId: this.configService.appleConfig.clientID,
      nonce: 'nonce', // optional
    });

    const email = jwtClaims.email;
    const appleUser = await this.appleAuthService.findAppleUserByUserEmail(
      email,
    );

    if (!appleUser) {
      // need to register
      const newKakaoUser = await this.appleAuthService.register(
        email,
        dto.accessToken,
        '',
      );
      const jwtToken = this.jwtService.sign({
        id: newKakaoUser.userId,
        vendor: 'apple',
        name: email,
        thumbnail: '',
      });
      return {
        user: {
          id: newKakaoUser.userId,
          vendor: 'apple',
          nickname: email,
          thumbnail: '',
          accessToken: jwtToken,
          isNew: true,
        },
      };
    } else {
      // just login
      const jwtToken = this.jwtService.sign({
        id: appleUser.userId,
        vendor: 'apple',
        nickname: email,
        thumbnail: '',
      });
      return {
        user: {
          id: appleUser.userId,
          vendor: 'apple',
          nickname: email,
          thumbnail: '',
          accessToken: jwtToken,
          isNew: false,
        },
      };
    }
  }
}

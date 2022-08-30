import { Body, Controller, Get, Header, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from '../service/google.auth.service';
import { GoogleTokenDto } from '../dto/google-token.dto';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/google')
@ApiTags('구글 인증 API')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('menu')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'google login menu',
    description: 'google 로그인 테스트용 메뉴',
  })
  async googleLoginPage(): Promise<string> {
    return `
      <div>
        <h1>구글 로그인</h1>

        <form action="/auth/google/login" method="GET">
          <input type="submit" value="구글 로그인" />
        </form>
    `;
  }

  @Get('/login')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'google login',
  })
  async googleLoginLogic(): Promise<void> {
    //redirect google login page
  }

  @Get('callback')
  @ApiOperation({
    summary: 'google login callback',
  })
  async googleLoginCallback(
    @Body() dto: GoogleTokenDto,
  ): Promise<JwtResponseDto> {
    const googleProfile = await this.googleAuthService.getGoogleProfile(
      dto.accessToken,
    );

    const googleInfo = googleProfile._json;
    const googleId = googleInfo.sub;
    const googleName = googleInfo.given_name;
    const googleEmail = googleInfo.email;
    const googleProfileImage = googleInfo.picture;

    const googleUser = await this.googleAuthService.findGoogleUser(googleId);
    if (!googleUser) {
      // need to register
      const newGoogleUser = await this.googleAuthService.register(
        googleId,
        googleEmail,
        googleName,
        dto.accessToken,
        googleProfileImage,
      );
      const jwtToken = this.jwtService.sign({
        id: newGoogleUser.userId,
        vendor: 'google',
        name: googleName,
        thumbnail: googleProfileImage,
      });
      return {
        user: {
          id: newGoogleUser.userId,
          vendor: 'google',
          nickname: googleName,
          thumbnail: googleProfileImage,
          accessToken: jwtToken,
          isNew: true,
        },
      };
    } else {
      // just login
      const jwtToken = this.jwtService.sign({
        id: googleUser.userId,
        vendor: 'google',
        nickname: googleName,
        thumbnail: googleProfileImage,
      });
      return {
        user: {
          id: googleUser.userId,
          vendor: 'google',
          nickname: googleName,
          thumbnail: googleProfileImage,
          accessToken: jwtToken,
          isNew: false,
        },
      };
    }
  }
}

import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google.auth.service';

@Controller('auth/google')
@ApiTags('구글 인증 API')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ApiConfigService,
  ) {}

  @Get('menu')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'google 로그인 테스트용 메뉴',
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
    summary: 'google 로그인 ',
    description: 'google 로그인',
  })
  async googleLoginLogic(): Promise<void> {
    //redirect google login page
  }

  @Get('/loginRedirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res): Promise<void> {
    console.log(req.user);
    await this.googleAuthService.login(req.user);
    return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>구글 로그인 성공하였습니다!</p>
            <a href="/auth/google/menu">메인으로</a>
          </div>
        `);
  }
}

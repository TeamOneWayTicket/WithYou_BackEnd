import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthService } from './kakao.auth.service';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Controller('auth/kakao')
export class KakaoAuthController {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly configService: ApiConfigService,
  ) {}

  @Get('menu')
  @Header('Content-Type', 'text/html')
  getKakaoLoginPage(): string {
    return `
      <div>
        <h1>카카오 로그인</h1>

        <form action="/auth/kakao/login" method="GET">
          <input type="submit" value="카카오 로그인" />
        </form>
        
         <form action="/auth/kakao/logout" method="GET">
          <input type="submit" value="카카오 로그아웃(일반)" />
        </form>

        <form action="/auth/kakao/unlink" method="GET">
          <input type="submit" value="카카오 로그아웃(unlink)" />
        </form>
    `;
  }

  @Get('/login')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('kakao'))
  kakaoLoginLogic(@Res() res): void {
    // kakaoGuard 가 처리해줌
  }

  @Get('/loginRedirect')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('kakao'))
  kakaoLoginLogicRedirect(@Req() req, @Res() res): void {
    this.kakaoAuthService.login(req.user);
    return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그인 성공하였습니다!</p>
            <a href="/auth/kakao/menu">메인으로</a>
          </div>
        `);
  }

  // 로그아웃 (일반적인 로그아웃, 토큰 만료)
  @Get('/logout')
  @Header('Content-Type', 'text/html')
  kakaoLogout(@Res() res): void {
    this.kakaoAuthService
      .logout()
      .then((e) => {
        return res.send(`
          <div>
            <h2>로그아웃 완료(토큰만료)</h2>
            <a href="/auth/kakao/menu">메인 화면으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('logout error');
      });
  }

  //로그 아웃 (탈퇴 or 다른 카카오 아이디로 로그인을 유도하는 경우, 로그 삭제)
  @Get('/unlink')
  @Header('Content-Type', 'text/html')
  kakaoUnlink(@Res() res): void {
    this.kakaoAuthService
      .deleteLog()
      .then((e) => {
        return res.send(`
          <div>
            <h2>로그아웃 완료(로그삭제)</h2>
            <a href="/auth/kakao/menu">메인 화면으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('logout error');
      });
  }
}

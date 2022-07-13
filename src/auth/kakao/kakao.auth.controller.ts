import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthService } from './kakao.auth.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { query } from 'express';
import { KakaoUser } from '../../user/kakao.user.entity';

@Controller('auth/kakao')
export class KakaoAuthController {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private configService: ApiConfigService,
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
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = this.configService.kakaoConfig.restapiKey;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = this.configService.kakaoConfig.callbackUrl;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @Get('/loginRedirect')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('kakao'))
  kakaoLoginLogicRedirect(@Req() req, @Res() res): void {
    console.log('loginRedirect start'); //Query()에서 code를 가져온다

    console.log(req.user);

    return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그인 성공하였습니다!</p>
            <a href="/auth/kakao/menu">메인으로</a>
          </div>
        `);
    //POST 요청을 위한 kakaoService
    // this.kakaoAuthService
    //   .getToken(_restApiKey, _redirectUrl, qs.code)
    //   .then((e) => {
    //     // console.log(e);
    //     console.log(`TOKEN : ${e.data['access_token']}`);
    //     this.kakaoAuthService.setToken(e.data['access_token']);
    //     this.kakaoAuthService.getUserInfo(e.data['access_token']).then((r) => {
    //       this.kakaoUserInfo(r);
    //     });
    //
    //     return res.send(`
    //       <div>
    //         <h2>축하합니다!</h2>
    //         <p>카카오 로그인 성공하였습니다!</p>
    //         <a href="/auth/kakao/menu">메인으로</a>
    //       </div>
    //     `);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.send('error');
    //   });
  }

  // 로그아웃 (일반적인 로그아웃, 토큰 만료)
  @Get('/logout')
  @Header('Content-Type', 'text/html')
  kakaoLogout(@Res() res): void {
    this.kakaoAuthService
      .logout()
      .then((e) => {
        console.log(e);
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
        console.log(e);
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

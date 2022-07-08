import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoService } from './kakao.service';
import { ApiConfigService } from '../shared/services/api-config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly kakaoService: KakaoService,
    private configService: ApiConfigService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('local')
  async login(@Req() req) {
    return req.user;
  }

  @Get('kakaoLogin')
  @Header('Content-Type', 'text/html')
  getKakaoLoginPage(): string {
    return `
      <div>
        <h1>카카오 로그인</h1>

        <form action="/auth/kakaoLoginLogic" method="GET">
          <input type="submit" value="카카오 로그인" />
        </form>
        
         <form action="/auth/kakaoLogout" method="GET">
          <input type="submit" value="카카오 로그아웃(일반)" />
        </form>

        <form action="/auth/kakaoUnlink" method="GET">
          <input type="submit" value="카카오 로그아웃(unlink)" />
        </form>
    `;
  }

  @Get('/kakaoLoginInfo')
  @Header('Content-Type', 'text/html')
  async kakaoUserInfo(@Res() res) {
    //GET요청을 보내기 위해 필요한 정보들
    const _url = 'https://kapi.kakao.com/v2/user/me';
    // console.log(res);
    const _headers = {
      headers: {
        Authorization: `Bearer ${res.access_token}`,
      },
    };
    // console.log(`토큰: ${res.access_token}`)
    this.kakaoService
      .showUserInfo(_url, _headers.headers)
      .then((e) => {
        console.log(e);
      })
      .catch((err) => {
        console.log(err);
        return res.send('error');
      });
  }

  @Get('/kakaoLoginLogic')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = this.configService.kakaoConfig.restapiKey;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = this.configService.kakaoConfig.callbackUrl;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @Get('/kakaoLoginRedirect')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogicRedirect(@Query() qs, @Res() res): void {
    console.log(qs.code); //Query()에서 code를 가져온다
    const _restApiKey = this.configService.kakaoConfig.restapiKey;
    const _redirectUrl = this.configService.kakaoConfig.callbackUrl;
    //code, restApiKey, _redirect_uri를 다시 카카오 api에게 POST요청을 보내준다
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    //POST 요청을 위한 kakaoService
    this.kakaoService
      .login(_hostName, _headers)
      .then((e) => {
        // console.log(e);
        console.log(`TOKEN : ${e.data['access_token']}`);
        this.kakaoService.setToken(e.data['access_token']);
        this.kakaoUserInfo(e.data);

        return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그인 성공하였습니다!</p>
            <a href="/auth/kakaoLogin">메인으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('error');
      });
  }

  // 로그아웃 (일반적인 로그아웃, 토큰 만료)
  @Get('/kakaoLogout')
  @Header('Content-Type', 'text/html')
  kakaoLogout(@Res() res): void {
    this.kakaoService
      .logout()
      .then((e) => {
        console.log(e);
        return res.send(`
          <div>
            <h2>로그아웃 완료(토큰만료)</h2>
            <a href="/auth/kakaoLogin">메인 화면으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('logout error');
      });
  }

  //로그 아웃 (탈퇴 or 다른 카카오 아이디로 로그인을 유도하는 경우, 로그 삭제)
  @Get('/kakaoUnlink')
  @Header('Content-Type', 'text/html')
  kakaoUnlink(@Res() res): void {
    this.kakaoService
      .deleteLog()
      .then((e) => {
        console.log(e);
        return res.send(`
          <div>
            <h2>로그아웃 완료(로그삭제)</h2>
            <a href="/auth/kakaoLogin">메인 화면으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('logout error');
      });
  }
}

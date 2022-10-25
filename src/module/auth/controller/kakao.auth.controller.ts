import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { KakaoAuthService } from '../service/kakao.auth.service';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import axios from 'axios';

@Controller('auth/kakao')
@ApiTags('카카오 인증 API')
export class KakaoAuthController {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly configService: ApiConfigService,
  ) {}

  @Get('menu')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'kakao login menu',
    description: 'kakao 로그인 테스트용 메뉴',
  })
  async getKakaoLoginPage(): Promise<string> {
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

  @Get('/:id/logout')
  @ApiOperation({
    summary: 'kakao logout',
    description: 'kakao accessToken, redirectToken 만료시킴 ',
  })
  async kakakoLogout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const kakaoUser = await this.kakaoAuthService.findKakaoUserByUserId(id);

    try {
      await axios({
        method: 'get',
        url: `https://kauth.kakao.com//oauth/logout?client_id=${this.configService.kakaoConfig.restApiKey}&logout_redirect_uri=${this.configService.kakaoConfig.logoutRedirectUrl}`,
        headers: {
          Authorization: `Bearer ${kakaoUser.accessToken}`,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/login')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = this.configService.kakaoConfig.restApiKey;
    const _redirectUrl = this.configService.kakaoConfig.loginRedirectUrl;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @Get('/redirect')
  @Header('Content-Type', 'text/html')
  async kakaoLoginLogicRedirect(@Query() qs, @Res() res): Promise<any> {
    const _restApiKey = this.configService.kakaoConfig.restApiKey;
    const _redirectUrl = this.configService.kakaoConfig.loginRedirectUrl;
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    const accessToken = await this.kakaoAuthService
      .getAccessToken(_hostName, _headers)
      .catch((err) => {
        throw new BadRequestException(err);
      });

    const token = (await this.kakaoAuthService.login(accessToken)).jwtToken;
    res.cookie('jwt', token, {
      domain: '.with-you.io',
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    });
    return res.redirect(302, 'https://frontend.with-you.io/');
  }

  @Get('/:id/unlink')
  @Redirect('/auth/kakao/menu')
  @ApiOperation({
    summary: 'kakao unlink',
  })
  async kakakoUnlink(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const kakaoUser = await this.kakaoAuthService.findKakaoUserByUserId(id);

    try {
      await axios({
        method: 'post',
        url: 'https://kapi.kakao.com/v1/user/unlink',
        headers: {
          Authorization: `Bearer ${kakaoUser.accessToken}`,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

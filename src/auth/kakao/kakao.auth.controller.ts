import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthService } from './kakao.auth.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { KakaoTokenDTO } from '../auth.DTO/kakaoTokenDto';
import { JwtTokenPayload } from '../jwt/jwt.token.payload';
import { JwtTokenResponse } from '../auth.DTO/jwtTokenResponse';
import { JwtAccessTokenResponse } from '../auth.DTO/jwtAccessTokenResponse';
import { contains } from 'class-validator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/kakao')
@ApiTags('카카오 인증 API')
export class KakaoAuthController {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('menu')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'kakao 로그인 테스트용 메뉴',
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

  // @Get('validate')
  // @ApiOperation({
  //   summary: 'token 검증 ',
  //   description: 'token 유효성 검증',
  // })
  // async validateToken() {
  //   this.authService.
  // }

  @Post('callback')
  @UsePipes(ValidationPipe)
  async kakaoLoginCallback(
    @Body() tokens: KakaoTokenDTO,
  ): Promise<JwtAccessTokenResponse> {
    const kakaoId = await this.kakaoAuthService.getKakaoProfile(
      tokens.access_token,
    );
    let jwtToken;
    const kakaoUser = await this.kakaoAuthService.findKakaoUser(kakaoId);
    // need to register
    if (!kakaoUser) {
      const newKakaoUser = await this.kakaoAuthService.register(
        kakaoId,
        tokens.access_token,
        tokens.refresh_token,
      );

      const payload = {
        userType: 'kakao',
        userId: newKakaoUser.userId,
      } as JwtTokenPayload;
      jwtToken = this.jwtService.sign(payload);
    } else {
      // just login
      const payload = {
        userType: 'kakao',
        userId: kakaoUser.userId,
      } as JwtTokenPayload;
      jwtToken = this.jwtService.sign(payload);
    }
    return {
      accessToken: jwtToken,
    };
  }

  @Get('/login')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'kakao 로그인 ',
    description: 'kakao 로그인',
  })
  async kakaoLoginLogic(@Res() res) {
    // kakaoGuard 가 처리해줌
  }

  @Get('/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'kakao 로그인 redirect',
    description: 'kakao 로그인 redirect',
  })
  async kakaoLoginRedirect(@Req() req, @Res() res) {
    console.log(req.user);
    // const kakaoUser = await this.kakaoAuthService.findKakaoUser(req.user);
    // // need to register
    // if (!kakaoUser) {
    //   const newKakaoUser = await this.kakaoAuthService.register(
    //     req.user.kakaoId,
    //     req.user.accessToken,
    //     req.user.refreshToken,
    //   );
    //
    //   const payload = {
    //     userType: 'kakao',
    //     userId: newKakaoUser.userId,
    //   } as JwtTokenPayload;
    //   res.setHeader(
    //     'Authorization',
    //     await this.authService.getJwtToken(payload),
    //   );
    // } else {
    //   // just login
    //   const payload = {
    //     userType: 'kakao',
    //     userId: kakaoUser.userId,
    //   } as JwtTokenPayload;
    //   res.setHeader(
    //     'Authorization',
    //     await this.authService.getJwtToken(payload),
    //   );
    //   console.log('kakao.login.redirect.res', res);
    // }
    // return res.redirect(state ? state : '/');
  }

  @Get('/:id/logout')
  @ApiOperation({
    summary: 'kakao 로그인 상태 logout',
    description: 'kakao accessToken, redirectToken 만료시킴 ',
  })
  async kakakoLogout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const kakaoUser = await this.kakaoAuthService.findKakaoUserByUserId(id);

    try {
      const logout = await axios({
        method: 'get',
        url: `https://kauth.kakao.com//oauth/logout?client_id=${this.configService.kakaoConfig.restApiKey}&logout_redirect_uri=${this.configService.kakaoConfig.logoutRedirectUrl}`,
        headers: {
          Authorization: `Bearer ${kakaoUser.accessToken}`,
        },
      });
      console.log('kakao.auth.logout ', logout.request);
      //res.redirect(logout.request.res);
    } catch (error) {
      console.error(error);
      //res.json(error);
    }
  }

  @Get('/logoutRedirect')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'kakao 로그인 redirect',
    description: 'kakao 로그인 redirect',
  })
  async kakaoLogoutLogicRedirect(@Req() req, @Res() res): Promise<void> {
    //this.kakaoAuthService.login(req.user);
    return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그아웃 성공하였습니다!</p>
            <a href="/auth/kakao/menu">메인으로</a>
          </div>
        `);
  }

  @Get('/:id/unlink')
  @ApiOperation({
    summary: 'kakao 로그인 상태 unlink',
    description: 'kakao accessToken ',
  })
  async kakakoUnlink(
    @Param('id', ParseIntPipe) id: number,
    @Res() res,
  ): Promise<void> {
    const kakaoUser = await this.kakaoAuthService.findKakaoUserByUserId(id);

    try {
      const logout = await axios({
        method: 'post',
        url: 'https://kapi.kakao.com/v1/user/unlink',
        headers: {
          Authorization: `Bearer ${kakaoUser.accessToken}`,
        },
      });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
    res.redirect('/auth/kakao/menu');
  }

  @Get('/:id/renew-Token')
  @ApiOperation({
    summary: 'kakao 로그인 상태 unlink',
    description: 'kakao accessToken ',
  })
  async kakakoRenewToken(@Param('id', ParseIntPipe) id: number) {
    const kakaoUser = await this.kakaoAuthService.findKakaoUserByUserId(id);
    await this.kakaoAuthService.renewToken(kakaoUser);
  }
}

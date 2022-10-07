import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KakaoAuthService } from '../service/kakao.auth.service';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import axios from 'axios';
import { KakaoTokenDto } from '../dto/kakao-token.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from '../dto/jwt.dto';

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

  @Post('callback')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'kakao login callback',
    description: '카카오 access 토큰 받아 jwt 토큰 발급',
  })
  async kakaoLoginCallback(@Body() dto: KakaoTokenDto): Promise<JwtDto> {
    const kakaoProfile = await this.kakaoAuthService.getKakaoProfile(
      dto.accessToken,
    );

    const kakaoInfo = kakaoProfile._json;
    const kakaoId = kakaoInfo.id;
    const kakaoName = kakaoInfo.properties.nickname;
    const kakaoProfileImage = kakaoInfo.properties.profile_image;
    const kakaoUser = await this.kakaoAuthService.findKakaoUser(kakaoId);
    if (!kakaoUser) {
      // need to register
      const newKakaoUser = await this.kakaoAuthService.register(
        kakaoId,
        dto.accessToken,
        kakaoProfileImage,
      );
      const jwtToken = this.jwtService.sign({
        id: newKakaoUser.userId,
        vendor: 'kakao',
        name: kakaoName,
        thumbnail: kakaoProfileImage,
      });
      return { jwtToken };
    } else {
      // just login
      const jwtToken = this.jwtService.sign({
        id: kakaoUser.userId,
        vendor: 'kakao',
        nickname: kakaoName,
        thumbnail: kakaoProfileImage,
      });
      return { jwtToken };
    }
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
      httpOnly: true,
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

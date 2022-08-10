import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthService } from './kakao.auth.service';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from '../auth.service';
import axios from 'axios';
import { KakaoTokenDto } from '../dto/kakao-token.dto';
import { JwtPayload } from '../jwt/jwt.payload.interface';
import { JwtAccessTokenResponseDto } from '../dto/jwt-access-token-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenDto } from '../dto/jwt-token.dto';
import { JwtTokenValidationDto } from '../dto/jwt-token-validation.dto';
import { UserService } from '../../user/user.service';
import { BaseUserResponse } from "../../user/userDto/baseUserResponse";

@Controller('auth/kakao')
@ApiTags('카카오 인증 API')
export class KakaoAuthController {
  constructor(
    private readonly kakaoAuthService: KakaoAuthService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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

  @Post('validate')
  @ApiOkResponse({ description: '성공', type: JwtTokenValidationDto })
  @ApiOperation({
    summary: 'token 검증 ',
    description: 'token 유효성 검사 및 유저 최소 정보가 입력되었는지 알려줌',
  })
  async validateToken(
    @Body() token: JwtTokenDto,
  ): Promise<JwtTokenValidationDto> {
    try {
      const result = await this.jwtService.verify(token.jwtToken);
      return {
        isNew: !(await this.userService.hasMinimumInfo(result.userId)),
      };
    } catch (e) {
      throw new BadRequestException('유효하지 않은 토큰입니다');
    }
  }

  @Post('callback')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 access 토큰 받아 jwt 토큰 발급',
  })
  async kakaoLoginCallback(
    @Body() dto: KakaoTokenDto,
  ): Promise<JwtAccessTokenResponseDto> {
    const _kakaoProfile = await this.kakaoAuthService.getKakaoProfile(
      dto.accessToken,
    );

    const _kakaoInfo = _kakaoProfile._json;
    const kakaoId = _kakaoInfo.id;
    const kakaoName = _kakaoInfo.properties.nickname;
    const kakaoProfileImage = _kakaoInfo.properties.profile_image;
    const kakaoUser = await this.kakaoAuthService.findKakaoUser(kakaoId);

    if (!kakaoUser) {
      // need to register
      const newKakaoUser = await this.kakaoAuthService.register(
        kakaoId,
        dto.accessToken,
      );
      const payload: JwtPayload = {
        userType: 'kakao',
        userId: newKakaoUser.userId,
        userName: kakaoName,
        userProfile: kakaoProfileImage,
      };
      const jwtToken = this.jwtService.sign(payload);
      return {
        accessToken: jwtToken,
        isNew: true,
      };
    } else {
      // just login
      const payload: JwtPayload = {
        userType: 'kakao',
        userId: kakaoUser.userId,
        userName: kakaoName,
        userProfile: kakaoProfileImage,
      };
      const jwtToken = this.jwtService.sign(payload);
      return {
        accessToken: jwtToken,
        isNew: false,
      };
    }
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
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/logoutRedirect')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: 'kakao 로그인 redirect',
    description: 'kakao 로그인 redirect',
  })
  kakaoLogoutLogicRedirect(@Req() req, @Res() res) {
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
      throw new BadRequestException(error);
    }
    res.redirect('/auth/kakao/menu');
  }
}

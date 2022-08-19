import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KakaoAuthService } from './kakao.auth.service';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { KakaoTokenDto } from '../dto/kakao-token.dto';
import { JwtResponseDto } from '../dto/jwt-response.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

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
  async kakaoLoginCallback(
    @Body() dto: KakaoTokenDto,
  ): Promise<JwtResponseDto> {
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
      const jwtToken = this.jwtService.sign({
        userId: newKakaoUser.userId,
        userType: 'kakao',
        userName: kakaoName,
        userProfile: kakaoProfileImage,
      });
      return {
        userId: newKakaoUser.userId,
        userType: 'kakao',
        userName: kakaoName,
        userProfile: kakaoProfileImage,
        accessToken: jwtToken,
        isNew: true,
      };
    } else {
      // just login
      const jwtToken = this.jwtService.sign({
        userId: kakaoUser.userId,
        userType: 'kakao',
        userName: kakaoName,
        userProfile: kakaoProfileImage,
      });
      return {
        userId: kakaoUser.userId,
        userType: 'kakao',
        userName: kakaoName,
        userProfile: kakaoProfileImage,
        accessToken: jwtToken,
        isNew: false,
      };
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
    summary: 'kakao logout redirect',
  })
  kakaoLogoutLogicRedirect(@Res() res) {
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
    summary: 'kakao unlink',
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

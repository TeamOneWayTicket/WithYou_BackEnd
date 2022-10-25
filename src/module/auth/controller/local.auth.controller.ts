import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtValidationDto } from '../dto/jwt-validation.dto';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { User } from '../../user/entity/user.entity';
import { UserParam } from '../../../decorator/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { CreateLocalUserDto } from '../../user/dto/create-local.user.dto';
import { LocalAuthService } from '../service/local.auth.service';

@Controller('auth/local')
@ApiTags('인증 API')
export class LocalAuthController {
  constructor(
    private readonly localAuthService: LocalAuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  @ApiOkResponse({ description: '성공', type: User })
  @ApiOperation({
    summary: 'local register',
  })
  async register(@Body() dto: CreateLocalUserDto, @Res() res): Promise<void> {
    const user = await this.localAuthService.register(dto);
    const token = this.jwtService.sign({
      id: user.userId,
      vendor: 'local',
      nickname: '',
      thumbnail: '',
      isNew: true,
    });
    res.cookie('jwt', token, {
      domain: '.with-you.io',
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    });
    return res.redirect(302, 'https://frontend.with-you.io/');
  }

  @Post('/login')
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: JwtValidationDto })
  @ApiOperation({
    summary: 'local login',
  })
  async login(@UserParam() user: User): Promise<void> {
    // 회원가입 한적없는데 로그인 시도시 badreqest
    // 아니라면 jwt 발급 + 쿠키 세팅 쿠키 세팅 해줘야함
  }
}

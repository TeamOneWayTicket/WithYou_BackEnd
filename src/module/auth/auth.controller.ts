import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtValidationDto } from './dto/jwt-validation.dto';

import { UserService } from '../user/user.service';
import JwtAuthGuard from '../../guard/jwt.auth.guard';
import { JwtPayload } from './jwt/jwt.payload.interface';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/get-jwt-token')
  @ApiOkResponse({ description: '성공', type: JwtValidationDto })
  @ApiOperation({
    summary: 'getJwt',
    description: 'token 유효성 검사 및 유저 최소 정보가 입력되었는지 알려줌',
  })
  async login(@Query() query: JwtPayload): Promise<string> {
    return await this.authService.getJwtToken(query);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: '성공', type: JwtValidationDto })
  @ApiOperation({
    summary: 'validate jwt',
    description: 'token 유효성 검사 및 유저 최소 정보가 입력되었는지 알려줌',
  })
  async validateToken(@Req() req): Promise<JwtValidationDto> {
    try {
      return {
        userId: req.user.userId,
        userName: req.user.userName,
        userProfile: req.user.userProfile,
        userType: 'kakao',
        isNew: !(await this.userService.hasMinimumInfo(req.user.userId)),
      };
    } catch (e) {
      throw new BadRequestException('유효하지 않은 토큰입니다');
    }
  }
}

import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { JwtValidationDto } from '../dto/jwt-validation.dto';

import { UserService } from '../../user/service/user.service';
import { JwtPayload } from '../interface/jwt.payload.interface';
import { Auth } from '../../../decorator/http.decorator';
import { Role } from '../../../common/enum/role.enum';
import { User } from '../../user/entity/user.entity';
import { UserParam } from '../../../decorator/user.decorator';

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
  @Auth(Role.User)
  @ApiOkResponse({ description: '성공', type: JwtValidationDto })
  @ApiOperation({
    summary: 'validate jwt',
    description: 'token 유효성 검사 및 유저 최소 정보가 입력되었는지 알려줌',
  })
  async validateToken(@UserParam() dto: User): Promise<JwtValidationDto> {
    try {
      return {
        user: {
          ...dto,
          thumbnail: await this.userService.getFileUrl(dto.thumbnail),
          isNew: !(await this.userService.hasMinimumInfo(dto.id)),
        },
      };
    } catch (e) {
      throw new BadRequestException('유효하지 않은 토큰입니다');
    }
  }
}

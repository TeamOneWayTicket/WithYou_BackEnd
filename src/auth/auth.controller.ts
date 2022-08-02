import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from './jwt/jwt.auth.guard';
import { AuthService } from './auth.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local')
  async login(@Req() req) {
    return req.user;
  }

  @Get('/authenticate')
  //@UseGuards(JwtAuthGuard)
  async isAuthenticated(@Query() query: JwtTokenPayload): Promise<any> {
    return await this.authService.login(query);
  }
}

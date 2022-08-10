import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt/jwt.payload.interface';
import JwtAuthGuard from './jwt/jwt.auth.guard';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/get-jwt-token')
  async login(@Query() query: JwtPayload): Promise<string> {
    return await this.authService.getJwtToken(query);
  }

  @Post('/test-signin')
  @UseGuards(JwtAuthGuard)
  signin(@Req() req) {
    return req.user;
  }
}

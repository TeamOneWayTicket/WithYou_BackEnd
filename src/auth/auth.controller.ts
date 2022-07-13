import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiConfigService } from '../shared/services/api-config.service';

@Controller('auth')
export class AuthController {
  constructor(private configService: ApiConfigService) {}

  @UseGuards(AuthGuard('local'))
  @Post('local')
  async login(@Req() req) {
    return req.user;
  }
}

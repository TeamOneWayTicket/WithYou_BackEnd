import { Controller, Post, Req } from '@nestjs/common';
import { ApiConfigService } from '../shared/services/api-config.service';

@Controller('auth')
export class AuthController {
  constructor(private configService: ApiConfigService) {}

  @Post('local')
  async login(@Req() req) {
    return req.user;
  }
}

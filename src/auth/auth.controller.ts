import { Controller, Post, Req } from '@nestjs/common';
import { ApiConfigService } from '../shared/services/api-config.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private configService: ApiConfigService) {}

  @Post('local')
  async login(@Req() req) {
    return req.user;
  }
}

import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from './jwt/jwt.auth.guard';
import { AuthService } from './auth.service';
import { JwtTokenPayload } from './jwt/jwt.token.payload';
import { JwtResponse } from './auth.DTO/jwtResponse';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/authenticate')
  //@UseGuards(JwtAuthGuard)
  async isAuthenticated(@Query() query: JwtTokenPayload): Promise<any> {
    return await this.authService.tokenValidateUser(query);
  }

  @Get('/get-jwt-token')
  //@UseGuards(JwtAuthGuard)
  async login(@Query() query: JwtTokenPayload): Promise<JwtResponse> {
    return await this.authService.getJwtToken(query);
  }

  @Post('/test-signin')
  @UseGuards(AuthGuard('jwt'))
  signin(@Req() req) {
    console.log(req);
    return req.user;
  }
}

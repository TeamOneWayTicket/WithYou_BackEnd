import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoAuthService } from './kakao/kakao.auth.service';
import { KakaoStrategy } from './kakao/kakao.strategy';
import { KakaoAuthController } from './kakao/kakao.auth.controller';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController, KakaoAuthController],
  providers: [AuthService, LocalStrategy, KakaoAuthService, KakaoStrategy],
})
export class AuthModule {}

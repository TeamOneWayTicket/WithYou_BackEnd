import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoAuthService } from './kakao/kakao.auth.service';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { KakaoAuthController } from './kakao/kakao.auth.controller';
import { GoogleAuthController } from './google/google.auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleAuthService } from './google/google.auth.service';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController, KakaoAuthController, GoogleAuthController],
  providers: [
    AuthService,
    KakaoAuthService,
    KakaoStrategy,
    GoogleStrategy,
    GoogleAuthService,
  ],
})
export class AuthModule {}

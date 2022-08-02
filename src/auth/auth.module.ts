import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoAuthService } from './kakao/kakao.auth.service';
import { KakaoStrategy } from './kakao/kakao.strategy';
import { KakaoAuthController } from './kakao/kakao.auth.controller';
import { GoogleAuthController } from './google/google.auth.controller';
import { GoogleAuthService } from './google/google.auth.service';
import { GoogleStrategy } from './google/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LocalUser } from '../user/local.user.entity';
import { KakaoUser } from '../user/kakao.user.entity';
import { GoogleUser } from '../user/google.user.entity';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../shared/services/api-config.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([User, LocalUser, KakaoUser, GoogleUser]),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.secretkey,
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController, KakaoAuthController, GoogleAuthController],
  providers: [
    AuthService,
    KakaoAuthService,
    KakaoStrategy,
    GoogleAuthService,
    GoogleStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}

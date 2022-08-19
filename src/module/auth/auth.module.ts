import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoAuthService } from './service/kakao.auth.service';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { KakaoAuthController } from './controller/kakao.auth.controller';
import { GoogleAuthController } from './controller/google.auth.controller';
import { GoogleAuthService } from './service/google.auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { LocalUser } from '../user/entity/local.user.entity';
import { KakaoUser } from '../user/entity/kakao.user.entity';
import { GoogleUser } from '../user/entity/google.user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';

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
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
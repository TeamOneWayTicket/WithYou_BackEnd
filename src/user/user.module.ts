import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';
import { GoogleUser } from './google.user.entity';
import { UserPushToken } from './entity/user-push-token.entity';
import { UserPushTokenService } from './user-push-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      LocalUser,
      KakaoUser,
      GoogleUser,
      UserPushToken,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserPushTokenService],
  exports: [UserService, UserPushTokenService],
})
export class UserModule {}

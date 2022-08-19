import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { LocalUser } from './entity/local.user.entity';
import { KakaoUser } from './entity/kakao.user.entity';
import { GoogleUser } from './entity/google.user.entity';
import { UserPushToken } from './entity/user-push-token.entity';
import { UserPushTokenService } from './user-push-token.service';
import { Family } from '../family/entity/family.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      LocalUser,
      KakaoUser,
      GoogleUser,
      UserPushToken,
      Family,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserPushTokenService],
  exports: [UserService, UserPushTokenService],
})
export class UserModule {}

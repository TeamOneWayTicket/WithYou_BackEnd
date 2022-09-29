import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { KakaoUser } from './entity/kakao.user.entity';
import { GoogleUser } from './entity/google.user.entity';
import { UserPushToken } from './entity/user-push-token.entity';
import { UserPushTokenService } from './service/user-push-token.service';
import { Family } from '../family/entity/family.entity';
import { FamilyService } from '../family/family.service';
import { FamilyInviteCode } from '../family/entity/family.invite.code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      KakaoUser,
      GoogleUser,
      UserPushToken,
      Family,
      FamilyInviteCode,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserPushTokenService, FamilyService],
  exports: [UserService, UserPushTokenService],
})
export class UserModule {}

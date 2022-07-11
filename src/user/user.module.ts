import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';
import { KakaoUserController } from './kakao.user.controller';
import { LocalUserController } from './local.user.controller';
import { KakaoService } from '../auth/kakao.service';
import { LocalUserService } from './local.user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalUser, KakaoUser])],
  controllers: [UserController, KakaoUserController, LocalUserController],
  providers: [UserService, KakaoService, LocalUserService],
  exports: [UserService, KakaoService, LocalUserService],
})
export class UserModule {}

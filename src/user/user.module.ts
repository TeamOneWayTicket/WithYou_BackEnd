import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { LocalUser } from './local.user.entity';
import { KakaoUser } from './kakao.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalUser, KakaoUser])],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule.forFeature([User, LocalUser, KakaoUser]),
  ],
})
export class UserModule {}

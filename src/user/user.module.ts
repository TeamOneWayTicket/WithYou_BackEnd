import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserController } from './user.controller';
import { LocalUser } from '../entity/local.user.entity';
import { LocalUserModule } from './local/local.user.module';
import { KaKaoUser } from '../entity/kakao.user.entity';
import { KakaoUserModule } from './kakao/user.kakao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, LocalUser, KaKaoUser]),
    LocalUserModule,
    KakaoUserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

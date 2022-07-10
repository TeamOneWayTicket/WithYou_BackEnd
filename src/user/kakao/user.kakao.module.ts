import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoUser } from '../../entity/kakao.user.entity';
import { KakaoUserController } from './user.kakao.controller';
import { KakaoUserService } from './user.kakao.service';

@Module({
  imports: [TypeOrmModule.forFeature([KakaoUser])],
  controllers: [KakaoUserController],
  providers: [KakaoUserService],
  exports: [KakaoUserService],
})
export class KakaoUserModule {}

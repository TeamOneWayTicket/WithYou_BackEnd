import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { DiaryMedium } from './diary.medium.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, DiaryMedium]),
    AuthModule,
    JwtModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}

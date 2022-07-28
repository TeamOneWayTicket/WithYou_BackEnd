import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { DiaryMedium } from './diary.medium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, DiaryMedium])],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}

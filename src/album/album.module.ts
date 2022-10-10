import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryMedium } from '../module/diary/entity/diary.medium.entity';
import { Diary } from '../module/diary/entity/diary.entity';
import { DiaryModule } from '../module/diary/diary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, DiaryMedium]), DiaryModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}

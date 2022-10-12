import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryMedium } from '../diary/entity/diary.medium.entity';
import { Diary } from '../diary/entity/diary.entity';
import { DiaryModule } from '../diary/diary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, DiaryMedium]), DiaryModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}

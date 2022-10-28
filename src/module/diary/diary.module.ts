import { Module } from '@nestjs/common';
import { DiaryService } from './service/diary.service';
import { DiaryController } from './controller/diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entity/diary.entity';
import { DiaryMedium } from './entity/diary.medium.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { DiaryMediumController } from './controller/diary.medium.controller';
import { DiaryMediumService } from './service/diary.medium.service';
import { DiaryCommentController } from './controller/diary.comment.controller';
import { DiaryCommentService } from './service/diary.comment.service';
import { DiaryComment } from './entity/diary.comment.entity';
import { RecommendDiaryController } from './controller/recommend.diary.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, DiaryMedium, DiaryComment]),
    AuthModule,
    JwtModule,
    UserModule,
  ],
  controllers: [
    DiaryController,
    DiaryMediumController,
    DiaryCommentController,
    RecommendDiaryController,
  ],
  providers: [DiaryService, DiaryMediumService, DiaryCommentService],
})
export class DiaryModule {}

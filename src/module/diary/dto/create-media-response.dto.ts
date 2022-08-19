import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedium } from '../entity/diary.medium.entity';

export class CreateMediaResponseDto {
  @ApiProperty({ description: '일기' })
  diaryMedia: DiaryMedium[];
}

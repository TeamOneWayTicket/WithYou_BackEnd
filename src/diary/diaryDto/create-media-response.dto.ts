import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedium } from '../diary.medium.entity';

export class CreateMediaResponseDto {
  @ApiProperty({ description: '일기' })
  diaryMedia: DiaryMedium[];
}

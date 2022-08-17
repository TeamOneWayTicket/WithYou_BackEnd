import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedium } from '../diary.medium.entity';

export class CreateMediumResponseDto {
  @ApiProperty({ description: '일기' })
  diaryMedium: DiaryMedium[];
}

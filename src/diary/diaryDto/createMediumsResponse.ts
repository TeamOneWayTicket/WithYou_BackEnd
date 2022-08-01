import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedium } from '../diary.medium.entity';

export class CreateMediumsResponse {
  @ApiProperty({ description: '일기' })
  diaryMediums: DiaryMedium[];
}

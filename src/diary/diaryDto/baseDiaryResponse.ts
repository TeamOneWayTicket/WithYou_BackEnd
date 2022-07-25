import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../diary.entity';

export class BaseDiaryResponse {
  @ApiProperty({ description: '일기' })
  diary: Diary;
}

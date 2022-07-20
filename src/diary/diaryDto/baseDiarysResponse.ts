import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../diary.entity';

export class BaseDiarysResponse {
  @ApiProperty({ description: '일기' })
  diarys: Diary[];
}

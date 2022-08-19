import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../diary.entity';

export class DiariesResponseDto {
  @ApiProperty({ description: '일기' })
  diaries: Diary[];
}

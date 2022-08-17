import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../diary.entity';

export class DiaryResponseDto {
  @ApiProperty({ description: '일기' })
  diary: Diary;
}

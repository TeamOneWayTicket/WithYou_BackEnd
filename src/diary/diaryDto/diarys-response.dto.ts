import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../diary.entity';

export class DiarysResponseDto {
  @ApiProperty({ description: '일기' })
  diarys: Diary[];
}

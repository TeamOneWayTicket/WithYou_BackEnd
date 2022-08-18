import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedia } from '../diary.media.entity';

export class CreateMediumResponseDto {
  @ApiProperty({ description: '일기' })
  diaryMedium: DiaryMedia[];
}

import { ApiProperty } from '@nestjs/swagger';
import { DiaryMedium } from '../../module/diary/entity/diary.medium.entity';

export class MediaDto {
  @ApiProperty({ description: '사진/동영상' })
  media: DiaryMedium[];
}

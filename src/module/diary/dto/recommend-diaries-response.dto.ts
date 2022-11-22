import { ApiProperty } from '@nestjs/swagger';
import { DiaryResponseDto } from './diary-response.dto';

export class RecommendDiariesResponseDto {
  @ApiProperty({ description: '일기' })
  diaries: DiaryResponseDto[];

  @ApiProperty({ description: '주제' })
  subject: string;
}

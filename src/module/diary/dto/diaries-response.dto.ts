import { ApiProperty } from '@nestjs/swagger';
import { DiaryResponseDto } from './diary-response.dto';

export class DiariesResponseDto {
  @ApiProperty({ description: '일기' })
  diaries: DiaryResponseDto[];
}

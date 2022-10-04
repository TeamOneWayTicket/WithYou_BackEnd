import { ApiProperty } from '@nestjs/swagger';
import { DiaryResponseDto } from './diary-response.dto';

export class DiariesInfiniteResponseDto {
  @ApiProperty({ description: '일기' })
  diaries: DiaryResponseDto[];

  @ApiProperty({ description: '다음에 불러오기 시작할 일기의 id' })
  nextId: number;

  @ApiProperty({ description: '더 이상 불러올 일기 있는지 판별값' })
  isLast: boolean;
}

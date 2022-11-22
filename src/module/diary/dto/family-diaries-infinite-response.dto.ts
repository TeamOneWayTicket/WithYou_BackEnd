import { ApiProperty } from '@nestjs/swagger';
import { DiaryResponseDto } from './diary-response.dto';
import { RecommendBannerDto } from './recommend-banner.dto';

export class FamilyDiariesInfiniteResponseDto {
  @ApiProperty({ description: '일기' })
  diaries: DiaryResponseDto[];

  @ApiProperty({ description: '추천 배너' })
  banner: RecommendBannerDto;

  @ApiProperty({ description: '다음에 불러오기 시작할 일기의 id' })
  nextId: number;

  @ApiProperty({ description: '더 이상 불러올 일기 있는지 판별값' })
  isLast: boolean;
}

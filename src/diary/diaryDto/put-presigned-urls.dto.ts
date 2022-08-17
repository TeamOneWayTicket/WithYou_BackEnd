import { ApiProperty } from '@nestjs/swagger';

export class PutPresignedUrlsDto {
  @ApiProperty({ description: 'diaryId', example: 1 })
  diaryId: number;

  @ApiProperty({ description: 'media type', example: 'image/png' })
  contentType: string;

  @ApiProperty({ description: '갯수', example: 2 })
  quantity: number;
}

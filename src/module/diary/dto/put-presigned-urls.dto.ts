import { ApiProperty } from '@nestjs/swagger';
import { MediumInfosDto } from './medium-infos.dto';

export class PutPresignedUrlsDto {
  @ApiProperty({ description: 'diaryId', example: 1 })
  diaryId: number;

  @ApiProperty({
    description: 'media type & media quantity',
    example: [
      {
        contentType: 'image/png',
        quantity: 3,
      },
      {
        contentType: 'video/mp4',
        quantity: 1,
      },
    ],
  })
  mediumInfos: MediumInfosDto[];
}

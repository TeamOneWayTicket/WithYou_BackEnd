import { ApiProperty } from '@nestjs/swagger';
import { MediumInfoDto } from './medium-info.dto';

export class PutPresignedUrlsDto {
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
  mediaInfo: MediumInfoDto[];
}

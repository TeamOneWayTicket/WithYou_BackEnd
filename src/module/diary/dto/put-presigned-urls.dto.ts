import { ApiProperty } from '@nestjs/swagger';
import { MediumInfoDto } from './medium-info.dto';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PutPresignedUrlsDto {
  @ApiProperty({
    type: [MediumInfoDto],
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
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => MediumInfoDto)
  @ValidateNested({ each: true })
  mediaInfo: MediumInfoDto[];
}

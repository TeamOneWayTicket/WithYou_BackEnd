import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetPresignedUrlsDto {
  @ApiProperty({
    description: 'aws에서의 파일명',
    example: 'next-developer-2022-664번.png',
  })
  @IsArray()
  fileNamesInS3: string[];
}

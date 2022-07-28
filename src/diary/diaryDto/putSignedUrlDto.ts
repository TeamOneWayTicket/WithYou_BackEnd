import { ApiProperty } from '@nestjs/swagger';

export class PutSignedUrlDto {
  @ApiProperty({ description: 'media type' })
  contentType: string;

  @ApiProperty({ description: 'filePath' })
  filePath: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlDto {
  @ApiProperty({ description: 'media type' })
  contentType: string;

  @ApiProperty({ description: 'filePath' })
  filePath: string;
}

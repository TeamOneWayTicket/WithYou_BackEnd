import { ApiProperty } from '@nestjs/swagger';

export class PutSignedUrlDto {
  @ApiProperty({ description: 'userid', example: 1 })
  userId: number;

  @ApiProperty({ description: 'media type', example: 'image/png' })
  contentType: string;
}

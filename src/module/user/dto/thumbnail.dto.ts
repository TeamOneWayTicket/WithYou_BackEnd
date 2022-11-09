import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ThumbnailDto {
  @ApiProperty({ description: 'thumbnail filename' })
  @IsString()
  fileName: string;
}

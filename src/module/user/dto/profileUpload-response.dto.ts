import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileUploadResponseDto {
  @ApiProperty({ description: 'profile s3 url' })
  @IsString()
  s3Url: string;

  @ApiProperty({ description: 'profile s3 filename' })
  @IsString()
  fileName: string;
}

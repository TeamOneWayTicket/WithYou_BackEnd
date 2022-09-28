import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileResponseDto {
  @ApiProperty({ description: 'profile s3 url' })
  @IsString()
  s3Url: string;
}

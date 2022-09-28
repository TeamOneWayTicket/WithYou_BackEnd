import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileUploadDto {
  @ApiProperty({ description: 'file Type' })
  @IsString()
  contentType: string;
}

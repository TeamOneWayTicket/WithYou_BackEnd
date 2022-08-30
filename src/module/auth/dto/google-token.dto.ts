import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({ description: 'access token' })
  @IsString()
  accessToken: string;
}

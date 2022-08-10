import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtTokenValidationDto {
  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  @IsString()
  isNew: boolean;
}

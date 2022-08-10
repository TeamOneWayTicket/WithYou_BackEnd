import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtTokenValidationDTO {
  @ApiProperty({ description: '새로운 유저인지?' })
  @IsString()
  isNew: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtTokenDTO {
  @ApiProperty({ description: 'jwt token' })
  @IsString()
  jwtToken: string;
}

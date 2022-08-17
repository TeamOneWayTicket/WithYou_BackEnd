import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JwtDto {
  @ApiProperty({ description: 'jwt token' })
  @IsString()
  jwtToken: string;
}

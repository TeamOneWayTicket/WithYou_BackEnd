import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty({ description: 'jwtToken' })
  accessToken: string;
}

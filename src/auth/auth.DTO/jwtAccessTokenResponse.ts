import { ApiProperty } from '@nestjs/swagger';

export class JwtAccessTokenResponse {
  @ApiProperty({ description: 'jwtToken' })
  accessToken: string;

  @ApiProperty({ description: 'jwtToken' })
  isNew: boolean;
}

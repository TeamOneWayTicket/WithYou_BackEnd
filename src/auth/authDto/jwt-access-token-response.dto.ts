import { ApiProperty } from '@nestjs/swagger';

export class JwtAccessTokenResponseDto {
  @ApiProperty({ description: 'jwtToken' })
  accessToken: string;

  @ApiProperty({ description: '새로운 유저인지 판별하는 값' })
  isNew: boolean;
}

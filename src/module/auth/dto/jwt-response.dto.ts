import { ApiProperty } from '@nestjs/swagger';
import { JwtContentDto } from './jwt-content.dto';

export class JwtResponseDto {
  @ApiProperty({ description: '유저 info' })
  user: JwtContentDto;
}

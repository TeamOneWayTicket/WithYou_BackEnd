import { ApiProperty } from '@nestjs/swagger';
import { JwtValidationContentDto } from './jwt-validation-content.dto';

export class JwtValidationDto {
  @ApiProperty({ description: '유저 정보' })
  user: JwtValidationContentDto;
}

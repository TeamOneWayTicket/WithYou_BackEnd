import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ description: 'profile name' })
  @IsString()
  fileName: string;
}

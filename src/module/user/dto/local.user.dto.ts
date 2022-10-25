import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocalUserDto {
  @ApiProperty({ description: 'profile name' })
  @IsString()
  email: string;

  @ApiProperty({ description: '역할' })
  @IsString()
  password: string;
}

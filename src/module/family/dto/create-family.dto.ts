import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({ description: '가족 이름' })
  @IsString()
  name: string;
}

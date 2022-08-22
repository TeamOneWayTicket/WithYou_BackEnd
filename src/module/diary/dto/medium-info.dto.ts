import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MediumInfoDto {
  @ApiProperty({ description: 'media type', example: 'image/png' })
  @IsString()
  contentType: string;

  @ApiProperty({ description: '갯수', example: 2 })
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}

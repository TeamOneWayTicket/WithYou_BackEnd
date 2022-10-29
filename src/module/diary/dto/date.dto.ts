import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateDto {
  @ApiProperty({ description: '연도' })
  @IsNotEmpty()
  year: string;

  @ApiProperty({ description: '월' })
  @IsNotEmpty()
  month: string;

  @ApiProperty({ description: '일' })
  @IsNotEmpty()
  day: string;
}

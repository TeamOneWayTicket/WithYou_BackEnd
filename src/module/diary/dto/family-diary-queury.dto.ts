import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParseLocalDateTime } from '../../../decorator/transform.decorator';
import { LocalDateTime } from '@js-joda/core';

export class FamilyDiaryQueryDto {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsNotEmpty()
  @ParseLocalDateTime()
  date: LocalDateTime;
}

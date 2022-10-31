import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParseLocalDate } from '../../../decorator/transform.decorator';
import { LocalDate } from '@js-joda/core';

export class FamilyDiaryQueryDto {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsNotEmpty()
  @ParseLocalDate()
  date: LocalDate;
}

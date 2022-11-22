import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParseLocalDate } from '../../../decorator/transform.decorator';
import { LocalDate } from '@js-joda/core';

export class RecommendBannerDto {
  @ApiProperty({ description: '주제' })
  subject: string;

  @ApiProperty({ description: '이미지' })
  image: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsNotEmpty()
  @ParseLocalDate()
  date: LocalDate;
}

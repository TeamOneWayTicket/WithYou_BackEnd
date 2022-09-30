import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDiaryDto {
  @ApiProperty({ description: '일기장 내용', example: 'updateDiary test' })
  @IsString()
  content: string;
}

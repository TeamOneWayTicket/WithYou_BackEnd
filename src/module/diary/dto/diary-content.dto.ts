import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DiaryContentDto {
  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'diary media names',
    example: 'createDiary test',
  })
  @IsArray()
  fileNamesInS3: string[];
}

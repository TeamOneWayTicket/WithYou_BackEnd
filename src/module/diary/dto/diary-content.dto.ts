import { ApiProperty } from '@nestjs/swagger';

export class DiaryContentDto {
  @ApiProperty({ description: '일기장 내용', example: 'createDiary test' })
  content: string;

  @ApiProperty({
    description: 'diary media names',
    example: 'createDiary test',
  })
  fileNamesInS3: string[];
}

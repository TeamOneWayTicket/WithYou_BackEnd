import { ApiProperty } from '@nestjs/swagger';

export class CreateMediumsDto {
  @ApiProperty({ description: '일기 id', example: '1' })
  diaryId: number;

  @ApiProperty({
    description: 'aws에서의 파일명들',
  })
  fileNamesInS3: string[];
}

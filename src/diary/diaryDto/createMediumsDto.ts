import { ApiProperty } from '@nestjs/swagger';

export class CreateMediumsDto {
  @ApiProperty({ description: '일기 id', example: '1' })
  diaryId: number;

  @ApiProperty({
    description: 'aws에서의 파일명들',
    example:
      '[\n' +
      '        "36db7890-a727-4490-9e85-62e9bbb79fde.png",\n' +
      '        "7716c397-19bc-4466-a0d3-fbbf004e16e8.png",\n' +
      '        "7b146ce1-fcfb-479c-87ae-7167df3eb5f6.png"\n' +
      '    ]',
  })
  fileNamesInS3: string[];
}

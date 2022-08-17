import { Diary } from '../diary.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ description: '일기장 id' })
  diaryId: number;

  @ApiProperty({ description: '순서 번호' })
  order: number;

  @ApiProperty({ description: 's3에 저장된 파일명' })
  fileNameInS3: string;

  @ApiProperty({ description: 'diary' })
  diary: Diary;
}

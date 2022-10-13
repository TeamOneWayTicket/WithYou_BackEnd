import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AlbumMediumDto {
  @ApiProperty({ description: '사진/동영상 url' })
  @IsString()
  url: string;

  @ApiProperty({ description: '일기 id' })
  @IsNumber()
  diaryId: number;
}

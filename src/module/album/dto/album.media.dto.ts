import { ApiProperty } from '@nestjs/swagger';
import { AlbumMediumDto } from './album.medium.dto';

export class AlbumMediaDto {
  @ApiProperty({ description: '사진/동영상' })
  media: AlbumMediumDto[];
}
